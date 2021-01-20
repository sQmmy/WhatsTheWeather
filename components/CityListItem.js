import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Flag from "react-native-flags";

const CityListItem = ({ onClick, favCities, isFav = false, city }) => {
  const returnDate = (timestamp) => {
    let tab = timestamp.split(" ")[1].split(":");
    return tab[0] + ":" + tab[1];
  };

  const getUri = (list) => {
    return "http://openweathermap.org/img/wn/" + list[0].icon + "@2x.png";
  };

  return (
    <LinearGradient
      colors={["#6ba2e1", "#6ba2e1", "#6ba2e1"]}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          onClick(city.city.id, city.city.coord.lat, city.city.coord.lon);
        }}
      >
        <View style={styles.informationContainer}>
          <View style={styles.cityHeader}>
            <Text style={styles.title}>
              {city.city.name}, {city.city.country}
            </Text>
            <Flag style={styles.flagStyle} code={city.city.country} size={32} />
          </View>
          <View style={styles.cityFooter}>
            <FlatList
              horizontal={true}
              data={city.list}
              extraData={favCities}
              keyExtractor={(item) => item.dt.toString()}
              renderItem={({ item }) => (
                <View style={styles.forecastElement}>
                  <Text style={styles.elementText}>
                    {Math.round(item.main.temp_min)}/
                    {Math.round(item.main.temp_max)}°C
                  </Text>
                  <Image
                    source={{
                      uri: getUri(item.weather),
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

export default CityListItem;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingVertical: 8,
    height: 150,
  },
  image: {
    borderRadius: 10,
    flex: 1,
    resizeMode: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  flagStyle: {
    marginLeft: 16,
  },
  cityHeader: {
    flex: 1,
    flexDirection: "row",
  },
  cityFooter: {
    bottom: 0,
    alignItems: "center",
  },
  informationContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  forecastElement: {
    flex: 1,
    marginHorizontal: 26,
    marginBottom: 10,
  },
  elementIcon: {
    width: 36,
    height: 36,
  },
  elementText: {
    textAlign: "center",
  },
});
