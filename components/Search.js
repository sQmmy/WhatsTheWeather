import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
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
import CityListItem from "../components/CityListItem";
import * as API from "../api/openweather";
import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { connect } from "react-redux";
import i18n from "i18n-js";

const Search = ({ navigation, favCities }) => {
  const [cities, setCities] = useState([]);

  const [cityName, setCityName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [countryCode, setCountryCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      if (location !== null) {
        await requestCitiesByLatLon();
      }
    })();
  }, [location]);

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
    setIsLoading(true);
    let loc = await requestLocationToDevice();
    if (loc != null) {
      setLocation(loc);
    }
  };

  const requestLocationToDevice = async () => {
    try {
      await Location.requestPermissionsAsync();
      return await Location.getCurrentPositionAsync({});
    } catch (error) {
      setErrorMsg("locatePermissionNotProvided");
      setIsError(true);
    }
  };

  const requestCities = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const searchResult = await API.getForecastForCity(
        cityName,
        stateCode,
        countryCode
      );
      setCities([]);
      if (searchResult.cod == 404) {
        setErrorMsg("notFound");
        setIsError(true);
      } else {
        setCities([searchResult]);
      }
    } catch (error) {
      setErrorMsg("apiError");
      setIsError(true);
    }
    setIsLoading(false);
  };

  const requestCitiesByLatLon = async () => {
    setIsError(false);
    try {
      const searchResult = await API.getWeatherByLatLon(
        location.coords.latitude,
        location.coords.longitude
      );

      setCities([searchResult]);
    } catch (error) {
      setErrorMsg("apiError");
      setIsError(true);
    }
    setIsLoading(false);
  };

  const searchCities = () => {
    Keyboard.dismiss();
    if (cityName.length > 0) {
      requestCities();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("location")}</Text>
      <View style={styles.searchContainer}>
        <View style={styles.topSearchInput}>
          <View style={styles.elementInput}>
            <TextInput
              placeholder={i18n.t("cityNameInput")}
              style={styles.input}
              onChangeText={(text) => setCityName(text)}
            />
          </View>
          <View style={styles.elementInput}>
            <TextInput
              placeholder={i18n.t("stateNameInput")}
              style={styles.input}
              onChangeText={(text) => setStateCode(text)}
            />
          </View>
        </View>

        <View style={styles.bottomSearchInput}>
          <View style={styles.elementInput}>
            <TextInput
              placeholder={i18n.t("countryCodeInput")}
              style={styles.input}
              onChangeText={(text) => setCountryCode(text)}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonStyle}>
            <FontAwesome.Button
              name='search'
              disabled={cityName.length < 1}
              backgroundColor={Colors.mainBlue}
              onPress={searchCities}
              style={cityName.length < 1 ? styles.disabledButton : ""}
            >
              {i18n.t("searchButton")}
            </FontAwesome.Button>
          </View>
          <View style={styles.buttonStyle}>
            <FontAwesome.Button
              name='map-marker'
              backgroundColor={Colors.mainBlue}
              onPress={locateMe}
            >
              {i18n.t("locateButton")}
            </FontAwesome.Button>
          </View>
        </View>
      </View>

      <Text style={styles.title}>
        {cities.length != 0 ? i18n.t("resultsHeader") : ""}
      </Text>

      {isError ? (
        <DisplayError message={i18n.t(errorMsg)} />
      ) : isLoading ? (
        <View style={styles.loader}>
          <BlurView intensity={250} style={StyleSheet.absoluteFill} />
          <ActivityIndicator color={Colors.mainBlue} size='large' />
        </View>
      ) : (
        <FlatList
          data={cities}
          keyExtractor={(item) => item.city.id.toString()}
          renderItem={({ item }) => (
            <CityListItem
              city={item}
              onClick={navigateToCityDetails}
              isFav={isFavoriteCity(item.city.id)}
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
    favCities: state.favCitiesReducer.favoriteCitiesIds,
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
  buttonStyle: {
    width: 180,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  loader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
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
