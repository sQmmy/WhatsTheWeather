import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  View,
  Text,
  StyleSheet,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Colors from "../definitions/Colors";
import DisplayError from "./DisplayError";
import { connect } from "react-redux";
import CityListItem from "../components/CityListItem";
import * as API from "../api/openweather";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const Search = ({ navigation, favCities }) => {
  const [cities, setCities] = useState([]);

  const [cityName, setCityName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [location, setLocation] = useState(null);

  const isFavoriteCity = (cityId) => {
    if (favCities.findIndex((i) => i === cityId) !== -1) {
      return true;
    }
    return false;
  };

  const navigateToCityDetails = (cityId) => {
    navigation.navigate("ViewCity", { cityId });
  };

  const locateMe = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Vous n'avez pas donné les permissions de localisation");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    requestCitiesByLatLon();
  };

  const requestCities = async () => {
    setIsLoading(true);
    setIsError(false);
    setCities([]);
    try {
      const searchResult = await API.getWeatherByCity(
        cityName,
        stateCode,
        countryCode
      );
      setCities([searchResult]);
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  const requestCitiesByLatLon = async () => {
    setIsLoading(true);
    setIsError(false);
    setCities([]);
    try {
      const searchResult = await API.getWeatherByLatLon(
        location.coords.latitude,
        location.coords.longitude
      );
      setCities([searchResult]);
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  };

  const searchCities = () => {
    Keyboard.dismiss();
    requestCities();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emplacement</Text>
      <View style={styles.searchContainer}>
        <View style={styles.topSearchInput}>
          <View style={styles.elementInput}>
            <TextInput
              placeholder="Nom de la ville"
              style={{}}
              onChangeText={(text) => setCityName(text)}
            />
          </View>
          <View style={styles.elementInput}>
            <TextInput
              placeholder="Code de l'état"
              style={styles.input}
              onChangeText={(text) => setStateCode(text)}
            />
          </View>
        </View>

        <View style={styles.bottomSearchInput}>
          <View style={styles.elementInput}>
            <TextInput
              placeholder="Code du pays"
              style={styles.input}
              onChangeText={(text) => setCountryCode(text)}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonStyle}>
            <FontAwesome.Button
              name="search"
              disabled={cityName.length < 1}
              backgroundColor={Colors.mainBlue}
              onPress={searchCities}
            >
              Rechercher
            </FontAwesome.Button>
          </View>
          <View style={styles.buttonStyle}>
            <FontAwesome.Button
              name="map-marker"
              backgroundColor={Colors.mainBlue}
              onPress={locateMe}
            >
              Localisez-moi
            </FontAwesome.Button>
          </View>
        </View>
      </View>

      <Text style={styles.title}>Résultats</Text>

      {isError ? (
        <DisplayError message="Impossible de récupérer les données" />
      ) : isLoading ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={cities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CityListItem
              cityData={item}
              onClick={navigateToCityDetails}
              isFav={isFavoriteCity(item.id)}
            />
          )}
          refreshing={isLoading}
          onRefresh={searchCities}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    favCities: state.favoriteCitiesIds,
  };
};

export default connect(mapStateToProps)(Search);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  searchContainer: {
    flex: 1,
    marginBottom: 16,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  topSearchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  buttonStyle: {
    flex: 1,
    width: 180,
    marginVertical: 10,
  },
  bottomSearchInput: {
    alignItems: "center",
  },
  elementInput: {
    borderBottomWidth: 1,
    borderColor: "lightgray",
    height: 32,
    width: 140,
    paddingLeft: 10,
  },
});
