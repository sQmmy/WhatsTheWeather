import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Button,
} from "react-native";
import Colors from "../definitions/Colors.js";
import DisplayError from "./DisplayError";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { getWeatherByCityId } from "../api/openweather.js";

const City = ({ route, favCities, dispatch }) => {
  useEffect(() => {
    console.log("In useEffect!");
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
      const cityResult = await getWeatherByCityId(route.params.cityID);
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
      {isError ? (
        <DisplayError message="Impossible de récupérer les données du restaurants" />
      ) : isLoading ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.innerContainer}>
            {getThumbnail()}
            <View style={styles.identityContainerTop}>
              <View style={styles.identityRestaurant}>
                <Text style={styles.name}>{restaurant.name}</Text>
                <Text style={styles.content} numberOfLines={1}>
                  {restaurant.establishment.join()}
                </Text>
              </View>
              <View style={styles.reviewRestaurant}>
                <View
                  style={[
                    styles.containerNote,
                    {
                      backgroundColor:
                        "#" + restaurant.user_rating.rating_color,
                    },
                  ]}
                >
                  <Text style={styles.textNote}>
                    {restaurant.user_rating.aggregate_rating}
                  </Text>
                  <Text style={styles.textMaxNote}>/5</Text>
                </View>
                <Text style={styles.textVotes}>
                  {restaurant.user_rating.votes} votes
                </Text>
              </View>
            </View>
            <View style={styles.identityContainerBottom}>
              <Text style={[styles.title, { marginTop: 0 }]}>Cuisines</Text>
              <Text style={styles.content}>{restaurant.cuisines}</Text>
              <Text style={styles.title}>Numéro(s) de téléphone</Text>
              <Text style={styles.content}>{restaurant.phone_numbers}</Text>
              <Text style={styles.title}>Adresse</Text>
              <Text style={styles.content}>{restaurant.location.address}</Text>
              <Text style={styles.title}>Horaires d'ouverture</Text>
              {getTimings()}
              {displaySaveRestaurant()}
            </View>
          </View>
        </ScrollView>
      )}
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
