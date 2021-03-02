import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as API from "../api/openweather.js";
import * as MOMENT from "../utils/moment.js";
import * as TOOLBOX from "../utils/toolbox.js";
import i18n from "i18n-js";
import SevenDays from "../components/SevenDays.js";
import Details from "../components/Details.js";
import Barchart from "../components/Barchart.js";
import Alerts from "../components/Alerts.js";

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
        labels: completeResult.hourly.map((elem) =>
          MOMENT.returnDateTime(elem.dt, completeResult.timezone_offset)
        ),
        datasets: [
          {
            data: completeResult.hourly.map((elem) =>
              elem.pop != null ? Math.round(elem.pop * 100) : null
            ),
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
            <SevenDays daily={city.daily}></SevenDays>
            <Barchart barChartData={barChartData}></Barchart>
            <Details city={city}></Details>
            <Alerts city={city}></Alerts>
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
  updateText: {
    color: "white",
    fontSize: 8,
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
});
