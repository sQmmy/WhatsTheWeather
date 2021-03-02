import { LinearGradient } from "expo-linear-gradient";
import * as MOMENT from "../utils/moment.js";
import * as TOOLBOX from "../utils/toolbox.js";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import React from "react";
import i18n from "i18n-js";
import { Feather, FontAwesome } from "@expo/vector-icons";

const Details = ({ language, unit, city }) => {
  return (
    <LinearGradient
      colors={["#65a1e79c", "#65a1e79c", "#65a1e7de"]}
      style={{ borderRadius: 16, marginTop: 6 }}
    >
      <View style={styles.detailsContainer}>
        <View style={styles.detailsTopContainer}>
          <Text style={styles.containerTitle}>{i18n.t("details")}</Text>
        </View>
        <View style={styles.detailsContentContainer}>
          <View style={styles.detailsLeftElement}>
            <View style={styles.detailsElement}>
              <View style={styles.detailsKeyValue}>
                <View style={styles.detailsKeyText}>
                  <Text
                    style={{
                      color: "#cfcfcf",
                      fontSize: 10,
                    }}
                  >
                    {i18n.t("feelsLike")}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: "white" }}>
                    {Math.round(city.current.feels_like)}
                    {TOOLBOX.returnWeatherUnit(unit)}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsIcon}>
                <FontAwesome
                  name='thermometer-full'
                  color={"white"}
                  size={28}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </View>
          </View>
          <View style={styles.detailsRightElement}>
            <View style={styles.detailsElement}>
              <View style={styles.detailsKeyValue}>
                <View style={styles.detailsKeyText}>
                  <Text
                    style={{
                      color: "#cfcfcf",
                      fontSize: 10,
                    }}
                  >
                    {i18n.t(TOOLBOX.returnWindDirection(city.current.wind_deg))}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: "white" }}>
                    {TOOLBOX.returnSpeedUnit(
                      Math.round(city.current.wind_speed),
                      unit
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsIcon}>
                <Feather
                  name='wind'
                  size={28}
                  color='white'
                  style={{ width: 30 }}
                />
              </View>
            </View>
          </View>
          <View style={styles.detailsLeftElement}>
            <View style={styles.detailsElement}>
              <View style={styles.detailsKeyValue}>
                <View style={styles.detailsKeyText}>
                  <Text
                    style={{
                      color: "#cfcfcf",
                      fontSize: 10,
                    }}
                  >
                    {i18n.t("sunrise")}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: "white" }}>
                    {MOMENT.returnHour(
                      city.current.sunrise,
                      city.timezone_offset
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsIcon}>
                <Feather
                  name='sunrise'
                  size={28}
                  color='white'
                  style={{ width: 30, marginBottom: 10 }}
                />
              </View>
            </View>
          </View>
          <View style={styles.detailsRightElement}>
            <View style={styles.detailsElement}>
              <View style={styles.detailsKeyValue}>
                <View style={styles.detailsKeyText}>
                  <Text
                    style={{
                      color: "#cfcfcf",
                      fontSize: 10,
                    }}
                  >
                    {i18n.t("sunset")}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: "white" }}>
                    {MOMENT.returnHour(
                      city.current.sunset,
                      city.timezone_offset
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsIcon}>
                <Feather
                  name='sunset'
                  size={28}
                  color='white'
                  style={{ width: 30 }}
                />
              </View>
            </View>
          </View>
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

export default connect(mapStateToProps)(Details);

const styles = StyleSheet.create({
  detailsContainer: {
    height: 126,
    marginTop: 16,
  },
  containerTitle: {
    color: "#ffffffb3",
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsTopContainer: {
    height: 20,
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 12,
  },
  detailsContentContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  detailsElement: {
    height: 50,
    width: 170,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsLeftElement: {
    borderTopWidth: 0.5,
    borderColor: "white",
  },
  detailsRightElement: {
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: "white",
  },
  detailsKeyValue: {
    marginLeft: 32,
    marginTop: 6,
  },
  detailsIcon: {
    height: 36,
    width: 24,
    marginTop: 8,
    marginRight: 16,
  },
});
