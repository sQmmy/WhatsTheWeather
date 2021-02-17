import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { connect } from "react-redux";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as API from "../api/openweather.js";
import * as MOMENT from "../utils/moment.js";
import * as TOOLBOX from "../utils/toolbox.js";
import i18n from "i18n-js";
import { BarChart } from "react-native-chart-kit";

const CityScreen = ({
  language,
  unit,
  route,
  favCities,
  dispatch,
  navigation,
}) => {
  useEffect(() => {
    requestData();
  }, []);

  const [city, setCity] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await requestData();
    setRefreshing(false);
  };

  const getLastUpdateDate = () => {
    if (lastUpdate != null) {
      return (
        <View>
          <Text style={styles.updateText}>{lastUpdate.split(" ")[0]}</Text>
        </View>
      );
    }
  };

  const getLastUpdateTime = () => {
    if (lastUpdate != null) {
      return (
        <View style={{ marginHorizontal: 2 }}>
          <Text style={styles.updateText}>{lastUpdate.split(" ")[1]}</Text>
        </View>
      );
    }
  };

  const requestData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const completeResult = await API.getCompleteDataForLatLon(
        route.params.lat,
        route.params.lon,
        language,
        unit
      );
      setCity(completeResult);
      setBarChartData({
        labels: completeResult.daily.map((elem) => MOMENT.returnDate(elem.dt)),
        datasets: [
          {
            data: completeResult.daily.map((elem) => elem.humidity),
          },
        ],
      });
      navigation.setOptions({ headerTitle: route.params.cityName });
      setLastUpdate(MOMENT.now());
    } catch (error) {
      setIsError(true);
      console.log(error);
      setCity(null);
    }
    setIsLoading(false);
  };

  const saveCity = async () => {
    const action = {
      type: "SAVE_CITY",
      value: route.params.cityId,
    };
    dispatch(action);
  };

  const unsaveCity = async () => {
    const action = { type: "POP_CITY", value: route.params.cityId };
    dispatch(action);
  };

  const displaySaveCity = () => {
    if (favCities.findIndex((i) => i === route.params.cityId) !== -1) {
      return (
        <FontAwesome
          name='bookmark'
          color={"white"}
          style={styles.favIcon}
          onPress={unsaveCity}
          size={24}
        />
      );
    } else {
      return (
        <FontAwesome
          name='bookmark-o'
          color={"white"}
          style={styles.favIcon}
          onPress={saveCity}
          size={24}
        />
      );
    }
  };

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={["#1a5193", "#4d8dd5", "#4d8dd5"]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.dateTimeContainer}>
          <View style={{ flexDirection: "row", marginTop: 16 }}>
            <Text style={styles.updateText}>{i18n.t("lastUpdate")}</Text>
            {getLastUpdateDate()}
            {getLastUpdateTime()}
            {displaySaveCity()}
          </View>
        </View>
        {isLoading && !city ? (
          <View style={styles.loader}>
            <ActivityIndicator color={"white"} size='large' />
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <View style={styles.currentWeatherContainer}>
              <View style={styles.currentTemp}>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 92,
                    includeFontPadding: false,
                    marginVertical: -10,
                    fontWeight: "normal",
                    color: "white",
                  }}
                >
                  {Math.round(city.current.temp)}
                </Text>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {TOOLBOX.returnWeatherUnit(unit)}
                </Text>
              </View>
              <View style={styles.currentWeather}>
                <Text
                  style={{
                    marginLeft: 14,
                    marginTop: 4,
                    fontSize: 14,
                    includeFontPadding: false,
                    marginVertical: -10,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {city.current.weather.map((elem) => elem.main)}
                </Text>
                <Image
                  source={{
                    uri: API.getIconUri(city.current.weather),
                  }}
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </View>
            <LinearGradient
              colors={["#65a1e79c", "#65a1e79c", "#65a1e7de"]}
              style={{ borderRadius: 16 }}
            >
              <View style={styles.forecastContainer}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  horizontal={true}
                  data={city.daily}
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
            </LinearGradient>
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
                        <View style={styles.detailsValueText}>
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
                            {i18n.t(
                              TOOLBOX.returnWindDirection(city.current.wind_deg)
                            )}
                          </Text>
                        </View>
                        <View style={styles.detailsValueText}>
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
                        <View style={styles.detailsValueText}>
                          <Text style={{ color: "white" }}>
                            {MOMENT.returnHour(city.current.sunrise)}
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
                        <View style={styles.detailsValueText}>
                          <Text style={{ color: "white" }}>
                            {MOMENT.returnHour(city.current.sunset)}
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
            <LinearGradient
              colors={["#65a1e79c", "#65a1e79c", "#65a1e7de"]}
              style={{ borderRadius: 16, marginTop: 6 }}
            >
              <View style={styles.chartContainer}>
                <View style={styles.chartTopContainer}>
                  <Text style={styles.containerTitle}>
                    {i18n.t("humidityTitle")}
                  </Text>
                </View>
                <View style={styles.chartContentContainer}>
                  {barChartData != null ? (
                    <BarChart
                      data={barChartData}
                      width={Dimensions.get("window").width - 24}
                      height={220}
                      fromZero={true}
                      showValuesOnTopOfBars={true}
                      withInnerLines={false}
                      withHorizontalLabels={false}
                      colors={["#65a1e79c", "#65a1e79c", "#65a1e7de"]}
                      chartConfig={{
                        backgroundGradientFrom: "#65a1e79c",
                        backgroundGradientTo: "#65a1e7de",
                        barPercentage: 0.5,
                        color: (opacity = 1) =>
                          `rgba(255, 255, 255, ${opacity})`,
                        style: {
                          borderRadius: 16,
                        },
                      }}
                      style={{
                        borderRadius: 16,
                        paddingRight: 12,
                      }}
                    />
                  ) : (
                    <View style={styles.loader}>
                      <ActivityIndicator color={"white"} size='large' />
                    </View>
                  )}
                </View>
              </View>
            </LinearGradient>
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
                    <Text style={styles.containerDarkTitle}>
                      {i18n.t("alerts")}
                    </Text>
                    <MaterialCommunityIcons
                      name='alert-octagon'
                      size={24}
                      color='#ff0000c9'
                    />
                  </View>
                  {city.alerts != null ? (
                    city.alerts.map((alert, index) => {
                      return (
                        <View style={styles.alertElement}>
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
                                  {MOMENT.returnHour(alert.start)}
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
                                  {MOMENT.returnHour(alert.end)}
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
          </View>
        )}
      </ScrollView>
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

export default connect(mapStateToProps)(CityScreen);

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    marginHorizontal: 12,
  },
  cityHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 16,
    marginTop: 16,
  },
  currentWeatherContainer: { height: 200 },
  currentTemp: {
    flexDirection: "row",
  },
  currentWeather: {
    flexDirection: "row",
  },
  forecastContainer: {
    paddingVertical: 12,
    height: 120,
    padding: 20,
  },
  chartContainer: {
    height: 300,
    justifyContent: "center",
    width: 1200,
    alignSelf: "center",
    marginTop: 16,
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
  updateText: {
    color: "white",
    fontSize: 8,
  },
  containerTitle: {
    color: "#ffffffb3",
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerDarkTitle: {
    color: "#4d4c4cb8",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  favIcon: {
    backgroundColor: "transparent",
  },
  loader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
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
  iconInput: {
    marginHorizontal: 16,
    fontWeight: "bold",
    textShadowColor: "#000000",
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 1 },
  },
  detailsContainer: {
    height: 126,
    marginTop: 16,
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
  chartContainer: {
    height: 240,
    marginTop: 16,
  },
  chartTopContainer: {
    height: 20,
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 12,
  },
  chartContentContainer: {
    justifyContent: "center",
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
