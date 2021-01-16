import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import Colors from "../definitions/Colors.js";
import { connect } from "react-redux";
import * as API from "../api/openweather.js";

const City = ({ route, favCities, dispatch }) => {
  useEffect(() => {
    requestCity();
  }, []);

  const [city, setCity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const saveCity = async () => {
    const action = {
      type: "SAVE_CITY",
      value: route.params.cityID,
    };
    dispatch(action);
  };

  const unsaveCity = async () => {
    const action = { type: "POP_CITY", value: route.params.cityID };
    dispatch(action);
  };

  const displaySaveCity = () => {
    if (favCities.findIndex((i) => i === route.params.cityID) !== -1) {
      return (
        <Button
          title="Retirer des favoris"
          color={Colors.mainGreen}
          onPress={unsaveCity}
        />
      );
    }
    return (
      <Button
        title="Ajouter aux favoris"
        color={Colors.mainGreen}
        onPress={saveCity}
      />
    );
  };

  const requestCity = async () => {
    try {
      const cityResult = await API.getWeatherByCityId(route.params.cityID);
      setCity(cityResult);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
    }
  };

  const getCityBackground = () => {
    return (
      <View>
        <Text>City Background???</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text>Je suis une ville!</Text>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    favCities: state.favoriteCitiesIds,
  };
};

export default connect(mapStateToProps)(City);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    height: 180,
    backgroundColor: Colors.mainGreen,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  errorImg: {
    height: 128,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: "white",
  },
  identityContainerTop: {
    marginTop: 5,
    padding: 12,
    borderRadius: 5,
    backgroundColor: "white",
    flexDirection: "row",
  },
  identityContainerBottom: {
    marginTop: 16,
    elevation: 1,
    borderRadius: 3,
    padding: 12,
    backgroundColor: "white",
  },
  identityRestaurant: {
    flex: 4,
  },
  name: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
  },
  reviewRestaurant: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerNote: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textNote: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  textMaxNote: {
    fontSize: 12,
    marginLeft: 3,
    color: "white",
  },
  title: {
    marginTop: 16,
    color: Colors.mainGreen,
    fontWeight: "bold",
  },
});
