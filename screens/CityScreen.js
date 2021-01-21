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
} from "react-native";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as API from "../api/openweather.js";
import * as MOMENT from "../utils/moment.js";
import i18n from "i18n-js";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const saveCity = async () => {
    const action = {
      type: "SAVE_CITY",
      value: route.params.cityId,
    };
    dispatch(action);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await requestData();
    setRefreshing(false);
  };

  const getLastUpdateDate = () => {
    if (lastUpdate != null) {
      return (
        <View style={styles.dateContainer}>
          <Text style={styles.updateText}>{lastUpdate.split(" ")[0]}</Text>
        </View>
      );
    }
  };

  const getLastUpdateTime = () => {
    if (lastUpdate != null) {
      return (
        <View style={styles.timeContainer}>
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
      navigation.setOptions({ headerTitle: route.params.cityName });
      setLastUpdate(MOMENT.now());
    } catch (error) {
      setIsError(true);
      setCity(null);
    }
    setIsLoading(false);
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
          size={28}
        />
      );
    } else {
      return (
        <FontAwesome
          name='bookmark-o'
          color={"white"}
          style={styles.favIcon}
          onPress={saveCity}
          size={28}
        />
      );
    }
  };

  return (
    <LinearGradient
      colors={["#1a5193", "#4d8dd5", "#4d8dd5"]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.dateTimeContainer}>
          <View style={styles.timeContainer}>
            {getLastUpdateDate()}
            {getLastUpdateTime()}
            {displaySaveCity()}
          </View>
          <Text style={styles.updateText}>{i18n.t("lastUpdate")}</Text>
        </View>
        {isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator color={"white"} size='large' />
          </View>
        ) : (
          <View style={styles.contentContainer}>
            <LinearGradient
              colors={["#65a1e79c", "#65a1e79c", "#65a1e7de"]}
              style={{ borderRadius: 16 }}
            >
              <View style={styles.forecastContainer}>
                <FlatList
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
                        °C
                      </Text>
                    </View>
                  )}
                />
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
    flex: 1,
    marginTop: 40,
    marginHorizontal: 12,
    borderRadius: 16,
  },
  cityHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  timeContainer: { marginRight: 20 },
  dateTimeContainer: { flexDirection: "row-reverse", marginRight: 12 },
  contentContainer: {
    flex: 1,
    marginBottom: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  forecastContainer: {
    borderRadius: 16,
    paddingVertical: 8,
    height: 240,
  },
  lastUpdateElement: {},
  updateText: {
    color: "white",
    fontSize: 8,
  },
  cityName: {
    fontSize: 20,
    marginTop: 20,
    color: "#382424f0",
    textShadowColor: "#000000",
    textShadowRadius: 4,
    color: "white",
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
    marginHorizontal: 8,
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
  forecastDay: {
    fontSize: 16,
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
