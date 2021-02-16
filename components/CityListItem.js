import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Flag from "react-native-flags";
import { connect } from "react-redux";
import { getIconUri } from "../api/openweather";
import * as TOOLBOX from "../utils/toolbox.js";

const CityListItem = ({
  onClick,
  favCities,
  isFav = false,
  city,
  unit,
  weatherList,
}) => {
  const returnDate = (timestamp) => {
    let tab = timestamp.split(" ")[1].split(":");
    return tab[0] + ":" + tab[1];
  };

  const getStarIcon = () => {
    if (isFav) {
      return (
        <FontAwesome
          name='bookmark'
          color={"white"}
          style={styles.iconInput}
          size={36}
        />
      );
    } else {
      return (
        <FontAwesome
          name='bookmark-o'
          color={"white"}
          style={styles.iconInput}
          size={36}
        />
      );
    }
  };

  return (
    <LinearGradient
      colors={["#65a1e79c", "#65a1e79c", "#65a1e7de"]}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          onClick(city.id, city.coord.lat, city.coord.lon, city.name);
        }}
      >
        <View style={styles.informationContainer}>
          <View style={styles.cityHeader}>
            <View style={styles.cityHeaderElement}>
              <Text style={styles.title}>
                {city.name}, {city.country}
              </Text>
              <Flag style={styles.flagStyle} code={city.country} size={24} />
            </View>
            <View style={styles.cityHeaderElement}>{getStarIcon()}</View>
          </View>
          <View style={styles.cityFooter}>
            <FlatList
              horizontal={true}
              data={weatherList}
              extraData={favCities}
              keyExtractor={(item) => item.dt.toString()}
              renderItem={({ item }) => (
                <View style={styles.forecastElement}>
                  <Text style={styles.elementText}>
                    {Math.round(item.main.temp_min)}/
                    {Math.round(item.main.temp_max)}
                    {TOOLBOX.returnWeatherUnit(unit)}
                  </Text>
                  <Image
                    source={{
                      uri: getIconUri(item.weather),
                    }}
                    style={styles.elementIcon}
                  />
                  <Text style={styles.elementText}>
                    {returnDate(item.dt_txt)}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.userPreference.location,
    unit: state.userPreference.unit,
  };
};

export default connect(mapStateToProps)(CityListItem);

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingVertical: 8,
    height: 150,
  },
  flagStyle: {
    marginLeft: 16,
    marginTop: 2,
  },
  cityHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cityHeaderElement: {
    flexDirection: "row",
  },
  cityFooter: {
    alignItems: "center",
  },
  informationContainer: {
    flex: 1,
    marginLeft: 12,
  },
  forecastElement: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 10,
    alignItems: "center",
  },
  elementIcon: {
    width: 36,
    height: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#382424f0",
    textShadowColor: "#000000",
    textShadowRadius: 4,
    textShadowOffset: { width: 1, height: 1 },
    color: "white",
  },
  elementText: {
    fontSize: 10,
    textShadowColor: "#000000",
    textShadowRadius: 2,
    textShadowOffset: { width: 0.5, height: 0.5 },
    color: "white",
    textAlign: "center",
  },
  iconInput: {
    marginHorizontal: 16,
    fontWeight: "bold",
    textShadowColor: "#000000",
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
  },
});
