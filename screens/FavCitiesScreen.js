import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { connect } from "react-redux";
import DisplayError from "../components/DisplayError";

const FavCitiesScreen = ({ navigation, favCities }) => {
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
        const cityResult = await getCityById(id);
        cities.push(cityResult);
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
      {isError ? (
        <DisplayError message='Impossible de récupérer les villes' />
      ) : (
        <FlatList
          data={cities}
          extraData={favCities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CityListItem
              cityData={item}
              onClick={navigateToCityDetails}
              isFav={isFavoriteCity(item.id)}
            />
          )}
          refreshing={isRefreshing}
          onRefresh={refreshFavCities}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    favCities: state.favoriteCitiesIds,
    language: state.userPreference.location,
  };
};

export default connect(mapStateToProps)(FavCitiesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 16,
  },
});
