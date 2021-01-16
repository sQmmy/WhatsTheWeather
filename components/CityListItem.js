import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Colors from "../definitions/Colors";
import Assets from "../definitions/Assets";
import Flag from "react-native-flags";

const CityListItem = ({ onClick, isFav = false, cityData }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onClick(cityData.id);
      }}
    >
      <View style={styles.informationContainer}>
        <View style={styles.cityHeader}>
          <Text style={styles.title}>
            {cityData.name}, {cityData.sys.country}
          </Text>
          <Flag
            style={styles.flagStyle}
            code={cityData.sys.country}
            size={32}
          />
        </View>
        <Text style={styles.data}>Humidité : {cityData.main.humidity}</Text>
        <Text style={styles.data}>Pression : {cityData.main.pressure}</Text>
        <Text style={styles.data}>Température : {cityData.main.temp}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CityListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  flagStyle: {
    marginLeft: 10,
  },
  cityHeader: {
    flex: 1,
    flexDirection: "row",
  },
  informationContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  statContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  thumbnail: {
    width: 128,
    height: 128,
    borderRadius: 12,
    backgroundColor: Colors.mainGreen,
  },
  errorImg: {
    width: 128,
    height: 128,
    borderRadius: 12,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  data: {
    fontSize: 16,
  },
  icon: {
    tintColor: Colors.mainGreen,
  },
  stat: {
    marginLeft: 4,
  },
});
