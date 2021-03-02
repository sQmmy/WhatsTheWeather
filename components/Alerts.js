import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import React from "react";
import i18n from "i18n-js";
import * as MOMENT from "../utils/moment.js";

const Alerts = ({ language, unit, city }) => {
  return (
    <LinearGradient
      colors={["#65a1e79c", "#65a1e79c", "#65a1e7de"]}
      style={{ borderRadius: 16, marginTop: 6 }}
    >
      <View style={styles.alertsContainer}>
        <View style={styles.alertListContainer}>
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              borderBottomWidth: 0.7,
              borderBottomColor: "#5a5858eb",
            }}
          >
            <Text style={styles.containerDarkTitle}>{i18n.t("alerts")}</Text>
            <MaterialCommunityIcons
              name='alert-octagon'
              size={24}
              color='#ff0000c9'
            />
          </View>
          {city.alerts != null ? (
            city.alerts.map((alert, index) => {
              return (
                <View style={styles.alertElement} key={index}>
                  <View style={styles.alertEventContainer}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        maxWidth: 400,
                        fontSize: 20,
                      }}
                    >
                      {alert.event}
                    </Text>
                    <View style={styles.durationContainer}>
                      <MaterialCommunityIcons
                        name='timer-sand'
                        size={24}
                        color='#1a151ebf'
                      />
                      <View style={styles.durationElementContainer}>
                        <Text style={styles.durationElementStyle}>
                          {MOMENT.returnDayName(alert.start)}{" "}
                          {MOMENT.returnDate(alert.start)}{" "}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            alignSelf: "flex-end",
                            fontStyle: "italic",
                          }}
                        >
                          {MOMENT.returnHour(alert.start, city.timezone_offset)}
                        </Text>
                      </View>
                      <MaterialCommunityIcons
                        name='arrow-right-bold'
                        size={24}
                        color='#1a151ebf'
                      />
                      <View style={styles.durationElementContainer}>
                        <Text style={styles.durationElementStyle}>
                          {MOMENT.returnDayName(alert.end)}{" "}
                          {MOMENT.returnDate(alert.end)}{" "}
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            alignSelf: "flex-end",
                            fontStyle: "italic",
                          }}
                        >
                          {MOMENT.returnHour(alert.end, city.timezone_offset)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.alertDescriptionContainer}>
                    <Text>{alert.description}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={{ marginVertical: 6 }}>
              <Text style={styles.containerDarkTitle}>
                {i18n.t("noAlerts")}
              </Text>
            </View>
          )}
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

export default connect(mapStateToProps)(Alerts);

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginHorizontal: 12,
  },
  alertsContainer: {
    backgroundColor: "#ffffffe6",
    borderRadius: 16,
    marginBottom: 80,
  },
  alertListContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  alertElement: {
    marginVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#47474759",
    marginBottom: 6,
  },
  alertEventContainer: {
    flexDirection: "column",
  },
  alertDescriptionContainer: {
    maxWidth: 320,
    alignSelf: "flex-start",
    marginLeft: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  containerDarkTitle: {
    color: "#4d4c4cb8",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  elementIcon: {
    width: 36,
    height: 36,
  },
  durationContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  durationElementContainer: {
    marginHorizontal: 6,
  },
  durationElementStyle: {
    color: "#1a151ebf",
    fontWeight: "bold",
  },
});
