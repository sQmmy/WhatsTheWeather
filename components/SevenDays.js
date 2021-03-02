import { LinearGradient } from "expo-linear-gradient";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import * as API from "../api/openweather.js";
import * as MOMENT from "../utils/moment.js";
import * as TOOLBOX from "../utils/toolbox.js";
import { connect } from "react-redux";
import React from "react";
import i18n from "i18n-js";

const SevenDays = ({ language, unit, daily }) => {
  return (
    <LinearGradient
      colors={["#65a1e79c", "#65a1e79c", "#65a1e7de"]}
      style={{ borderRadius: 16, marginTop: 6 }}
    >
      <View style={styles.forecastContainer}>
        <View style={styles.forecastTopContainer}>
          <Text style={styles.containerTitle}>{i18n.t("minMaxSevenDays")}</Text>
        </View>
        <View style={styles.forecastContentContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={daily}
            keyExtractor={(item) => item.dt.toString()}
            renderItem={({ item }) => (
              <View style={styles.forecastElement}>
                <Text style={styles.forecastDay}>
                  {MOMENT.returnDayName(item.dt)}
                </Text>
                <Text style={styles.elementText}>
                  {MOMENT.returnDate(item.dt)}
                </Text>
                <Image
                  source={{
                    uri: API.getIconUri(item.weather),
                  }}
                  style={styles.elementIcon}
                />
                <Text style={styles.elementText}>
                  {Math.round(item.temp.min)}/{Math.round(item.temp.max)}
                  {TOOLBOX.returnWeatherUnit(unit)}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const mapStateToProps = (state) => {
  return {
    favCities: state.favCitiesReducer.favoriteCitiesIds,
    language: state.userPreference.location,
    unit: state.userPreference.unit,
  };
};

export default connect(mapStateToProps)(SevenDays);

const styles = StyleSheet.create({
  forecastContainer: {
    marginTop: 16,
  },
  forecastTopContainer: {
    height: 20,
    justifyContent: "center",
    marginLeft: 12,
  },
  containerTitle: {
    color: "#ffffffb3",
    fontWeight: "bold",
    marginBottom: 10,
  },
  forecastContentContainer: {
    paddingVertical: 12,
    height: 120,
    padding: 20,
  },
  forecastElement: {
    flex: 1,
    marginBottom: 10,
    alignItems: "center",
    width: 80,
  },
  elementIcon: {
    width: 36,
    height: 36,
  },
  elementText: {
    fontSize: 10,
    textShadowColor: "#000000",
    textShadowRadius: 2,
    textShadowOffset: { width: 0.5, height: 0.5 },
    color: "#e0e0e0",
    textAlign: "center",
  },
  forecastDay: {
    fontSize: 14,
    textShadowColor: "#000000",
    textShadowRadius: 2,
    textShadowOffset: { width: 0.5, height: 0.5 },
    color: "white",
    textAlign: "center",
  },
});
