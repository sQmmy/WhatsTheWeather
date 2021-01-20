import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Image,
} from "react-native";
import Flag from "react-native-flags";

const CityListItem = ({ onClick, isFav = false, city }) => {
  const returnDate = (timestamp) => {
    let tab = timestamp.split(" ")[1].split(":");
    return tab[0] + ":" + tab[1];
  };

  const getUri = (list) => {
    return "http://openweathermap.org/img/wn/" + list[0].icon + "@2x.png";
  };

  return (
    <ImageBackground
      source={require("../assets/cloudy.png")}
      style={styles.image}
      blurRadius={0.5}
    >
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          onClick(city.id);
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
              keyExtractor={(item) => item.dt.toString()}
              renderItem={({ item }) => (
                <View style={styles.forecastElement}>
                  <Text style={styles.elementText}>
                    {Math.round(item.main.temp)}°C
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
    </ImageBackground>
  );
};

export default CityListItem;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 20,
    borderColor: "black",
    paddingVertical: 8,
    height: 150,
  },
  image: {
    borderRadius: 20,
    flex: 1,
    resizeMode: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  flagStyle: {
    marginLeft: 10,
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
  statsContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  statContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  data: {
    fontSize: 16,
  },
  forecastElement: {
    flex: 1,
    marginHorizontal: 24,
  },
  elementIcon: {
    width: 36,
    height: 36,
  },
  elementText: {
    textAlign: "center",
  },
});
