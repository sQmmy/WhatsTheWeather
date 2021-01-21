import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { connect } from "react-redux";
import DisplayError from "../components/DisplayError";
import * as API from "../api/openweather";
import CityListItem from "../components/CityListItem";
import { LinearGradient } from "expo-linear-gradient";

const FavCitiesScreen = ({ navigation, language, unit, favCities }) => {
  const [cities, setCities] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    refreshFavCities();
  }, [favCities]);

  const refreshFavCities = async () => {
    setIsRefreshing(true);
    setIsError(false);
    let cities = [];
    try {
      for (const id of favCities) {
        const cityResult = await API.getWeatherByCityId(id);
        const completeResult = await API.getForecastForLatLon(
          cityResult.coord.lat,
          cityResult.coord.lon,
          language,
          unit
        );
        cities.push(completeResult);
      }
      setCities(cities);
    } catch (error) {
      setIsError(true);
      setCities([]);
    }
    setIsRefreshing(false);
  };

  const isFavoriteCity = (cityId) => {
    if (favCities.findIndex((i) => i === cityId) !== -1) {
      return true;
    }
    return false;
  };

  const navigateToCityDetails = (cityId) => {
    navigation.navigate("ViewCityScreen", { cityId });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a5193", "#4d8dd5", "#4d8dd5"]}
        style={{ flex: 1 }}
      >
        <View style={styles.secondContainer}>
          {isError ? (
            <DisplayError message='Impossible de récupérer les villes' />
          ) : (
            <FlatList
              data={cities}
              extraData={favCities}
              keyExtractor={(item) => item.city.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.cityListItem}>
                  <CityListItem
                    city={item.city}
                    weatherList={item.list}
                    onClick={navigateToCityDetails}
                    isFav={isFavoriteCity(item.city.id)}
                    style={styles.cityListItem}
                  />
                </View>
              )}
              refreshing={isRefreshing}
              onRefresh={refreshFavCities}
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    favCities: state.favCitiesReducer.favoriteCitiesIds,
    language: state.userPreference.location,
    unit: state.userPreference.unit,
  };
};

export default connect(mapStateToProps)(FavCitiesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  secondContainer: {
    flex: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  cityListItem: {
    marginVertical: 6,
  },
});
