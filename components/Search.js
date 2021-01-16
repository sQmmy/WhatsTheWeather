import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  FlatList,
  Keyboard,
} from "react-native";
import Colors from "../definitions/Colors";
import DisplayError from "./DisplayError";
import { connect } from "react-redux";

const Search = ({ navigation, favCities }) => {
  const [cities, setCities] = useState([]);
  const [cityName, setCityName] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {}, []);

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
    console.log(location);
  };

  const requestCities = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const searchResult = await getRestaurants(filter, offset);
    } catch (error) {
      setIsError(true);
      setCities([]);
    }
    setIsLoading(false);
  };

  const searchCities = () => {
    Keyboard.dismiss();
    requestCities();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Nom de la ville"
          style={styles.inputCityName}
          onChangeText={(text) => setCityName(text)}
        />
        <TextInput
          placeholder="Code de l'état"
          style={styles.inputCityName}
          onChangeText={(text) => setStateCode(text)}
        />
        <TextInput
          placeholder="Code du pays"
          style={styles.inputCityName}
          onChangeText={(text) => setCountryCode(text)}
        />
        <Button
          title="Rechercher"
          color={Colors.mainGreen}
          onPress={searchCities}
        />
        <Button
          title="Localisez-moi!"
          color={Colors.mainGreen}
          onPress={locateMe}
        />
      </View>
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
    marginBottom: 16,
  },
  inputCityName: {
    marginBottom: 8,
  },
});
