import React, { useState } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { connect } from "react-redux";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as googleAPI from "../api/googlemaps.js";
import * as weatherAPI from "../api/openweather.js";
import { FontAwesome } from "@expo/vector-icons";
import Flag from "react-native-flags";
import i18n from "i18n-js";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const MapScreen = ({
  language,
  unit,
  route,
  favCities,
  dispatch,
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cityInfo, setCityInfo] = useState(null);
  const [isError, setIsError] = useState(false);

  const requestLocation = (lat, lon) => {
    setIsLoading(true);
    try {
      googleAPI.getAddress(lat, lon).then((resp) => {
        getWeather(resp[0]);
      });
    } catch (error) {
      console.warn(error);
      setIsError(true);
    }
  };

  const getWeather = (data) => {
    try {
      weatherAPI
        .getForecastForCity(getCityName(data), null, null, language, unit)
        .then((weatherResp) => {
          setCityInfo(weatherResp);
          setIsLoading(false);
        });
    } catch (error) {
      console.warn(error);
      setIsError(true);
    }
  };

  const navigateToCityDetails = () => {
    navigation.navigate("ViewCityScreen", {
      cityId: cityInfo.city.id,
      lat: cityInfo.city.coord.lat,
      lon: cityInfo.city.coord.lon,
      cityName: cityInfo.city.name,
    });
  };

  const isFav = (cityId) => {
    if (favCities.findIndex((i) => i === cityId) !== -1) {
      return true;
    }
    return false;
  };

  const getCityName = (address) => {
    return address.address_components.filter(
      (adr) => adr.types.indexOf("locality") != -1
    )[0].long_name;
  };

  const getStarIcon = () => {
    if (isFav(cityInfo.city.id)) {
      return (
        <FontAwesome
          name='star'
          color={"black"}
          style={styles.favIcon}
          size={36}
        />
      );
    } else {
      return (
        <FontAwesome
          name='star-o'
          color={"black"}
          style={styles.favIcon}
          size={36}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        followUserLocation={true}
        zoomEnabled={true}
        style={styles.map}
        initialRegion={{
          latitude: 49.09612509999999,
          longitude: 6.227747000000022,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        onPress={(e) => {
          requestLocation(
            e.nativeEvent.coordinate.latitude,
            e.nativeEvent.coordinate.longitude
          );
        }}
        showsTraffic={false}
        showsPointsOfInterest={false}
      >
        <Marker
          key={"1"}
          coordinate={{
            latitude:
              cityInfo !== null ? cityInfo.city.coord.lat : 49.09612509999999,
            longitude:
              cityInfo !== null ? cityInfo.city.coord.lon : 6.227747000000022,
          }}
          title={cityInfo !== null ? cityInfo.city.name : "Undefined"}
          description={"ddd"}
        />
      </MapView>
      {cityInfo !== null ? (
        <View style={styles.cityContainer}>
          <View style={styles.cityInfoContainer}>
            {isLoading ? (
              <SkeletonPlaceholder
                backgroundColor={"#d8d9d9bf"}
                highlightColor={"#a2b4bee3"}
              >
                <SkeletonPlaceholder.Item
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <SkeletonPlaceholder.Item
                    height={26}
                    width={180}
                    borderRadius={16}
                  />
                  <SkeletonPlaceholder.Item
                    height={36}
                    borderRadius={100}
                    width={36}
                    marginRight={14}
                  />
                </SkeletonPlaceholder.Item>

                <SkeletonPlaceholder.Item
                  height={10}
                  marginVertical={16}
                  borderRadius={16}
                />
                <SkeletonPlaceholder.Item flexDirection={"row-reverse"}>
                  <SkeletonPlaceholder.Item
                    height={16}
                    marginTop={42}
                    width={160}
                    borderRadius={16}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            ) : (
              <View>
                <View style={styles.cityHeader}>
                  <View style={styles.cityHeaderElement}>
                    <Text style={styles.title}>{cityInfo.city.name}</Text>
                    <Flag
                      style={styles.flagStyle}
                      code={cityInfo.city.country}
                      size={24}
                    />
                  </View>
                  <View style={styles.cityHeaderElement}>{getStarIcon()}</View>
                </View>
                <View style={styles.cityContent}>
                  <Image
                    source={{
                      uri: weatherAPI.getIconUri(cityInfo.list[0].weather),
                    }}
                    style={styles.elementIcon}
                  />
                </View>
                <View style={styles.cityFooter}>
                  <Text
                    style={styles.navigateText}
                    onPress={navigateToCityDetails}
                  >
                    {i18n.t("viewCityWeather")} {">"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    favCities: state.favCitiesReducer.favoriteCitiesIds,
    language: state.userPreference.location,
    unit: state.userPreference.unit,
  };
};

export default connect(mapStateToProps)(MapScreen);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column-reverse",
  },
  cityContainer: {
    height: 160,
    width: 380,
    backgroundColor: "#ffffffd9",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    flex: 1,
    borderRadius: 10,
    marginBottom: 8,
  },
  cityInfoContainer: {
    backgroundColor: "transparent",
    height: 130,
    width: 340,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  flagStyle: {
    marginLeft: 16,
    marginTop: 2,
  },
  cityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cityHeaderElement: {
    flexDirection: "row",
  },
  cityFooter: {
    flexDirection: "row-reverse",
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
    color: "black",
  },
  elementText: {
    fontSize: 10,
    color: "black",
    textAlign: "center",
  },
  favIcon: {
    marginHorizontal: 16,
    marginBottom: 36,
    fontWeight: "bold",
  },
  navigateText: {
    margin: 10,
    color: "#2755d3",
  },
});
