import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import * as Localization from "expo-localization";
import { connect } from "react-redux";
import i18n from "i18n-js";
import { FontAwesome } from "@expo/vector-icons";
import CityScreen from "../screens/CityScreen";
import FavCitiesScreen from "../screens/FavCitiesScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Colors from "../definitions/Colors";
import MapScreen from "../screens/MapScreen";

const SearchNavigation = createStackNavigator();
const FavNavigation = createStackNavigator();
const SettingNavigation = createStackNavigator();
const MapNavigation = createStackNavigator();
const TabNavigation = createBottomTabNavigator();

const Navigation = ({ language, favCities }) => {
  i18n.translations = {
    fr: require("../locales/fr.json"),
    en: require("../locales/en.json"),
  };

  i18n.locale = language || Localization.locale;
  i18n.fallbacks = true;

  function settingsStackScreens({ navigation }) {
    return (
      <SettingNavigation.Navigator initialRouteName='ViewSettingsScreen'>
        <SettingNavigation.Screen
          name='ViewSettingsScreen'
          component={SettingsScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: "black",
            headerTintColor: "black",
            headerTitleAlign: "center",
            headerTitle: i18n.t("menuTopSettings"),
          }}
        ></SettingNavigation.Screen>
      </SettingNavigation.Navigator>
    );
  }

  function DefaultNavigator({ navigation }) {
    return (
      <TabNavigation.Navigator
        initialRouteName={i18n.t("menuBottomSearch")}
        tabBarOptions={{
          activeTintColor: "#ffffff",
          activeBackgroundColor: "#484747",
          inactiveBackgroundColor: "transparent",
          backgroundColor: "transparent",
          style: {
            backgroundColor: "#3b3a3a",
          },
        }}
      >
        <TabNavigation.Screen
          name={i18n.t("menuBottomSearch")}
          component={searchStackScreens}
          options={() => ({
            tabBarIcon: () => (
              <FontAwesome
                name={"search"}
                backgroundColor={"transparent"}
                color={"white"}
                size={22}
                style={{ marginTop: 4 }}
              ></FontAwesome>
            ),
          })}
        />
        <TabNavigation.Screen
          name={i18n.t("menuTopMap")}
          component={mapStackScreens}
          options={{
            headerTitle: i18n.t("menuTopMap"),
            tabBarIcon: () => (
              <FontAwesome
                name={"globe"}
                backgroundColor={"transparent"}
                color={"white"}
                size={22}
                style={{
                  marginTop: 4,
                }}
              ></FontAwesome>
            ),
          }}
        />
        <TabNavigation.Screen
          name={i18n.t("menuBottomFav")}
          component={favStackScreens}
          options={() => ({
            tabBarBadge: favCities.length,
            tabBarBadgeStyle: { backgroundColor: "#3d82b3" },
            tabBarIcon: () => (
              <FontAwesome
                name={"star"}
                backgroundColor={"transparent"}
                color={"white"}
                size={22}
                style={{ marginTop: 4 }}
              ></FontAwesome>
            ),
          })}
        />
        <TabNavigation.Screen
          name={i18n.t("menuTopSettings")}
          component={settingsStackScreens}
          options={{
            headerTitle: i18n.t("menuTopSettings"),
            tabBarIcon: () => (
              <FontAwesome
                name={"cog"}
                backgroundColor={"transparent"}
                color={"white"}
                size={22}
                style={{ marginTop: 4 }}
              ></FontAwesome>
            ),
          }}
        />
      </TabNavigation.Navigator>
    );
  }

  function mapStackScreens({ navigation }) {
    return (
      <MapNavigation.Navigator initialRouteName='ViewMapScreen'>
        <MapNavigation.Screen
          name='ViewMapScreen'
          component={MapScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: "#d8d5d5",
            headerTintColor: "#020b5f",
            headerTitleAlign: "center",
            headerTitle: i18n.t("menuTopMap"),
          }}
        ></MapNavigation.Screen>
      </MapNavigation.Navigator>
    );
  }

  function searchStackScreens({ navigation }) {
    return (
      <SearchNavigation.Navigator initialRouteName='ViewSearchScreen'>
        <SearchNavigation.Screen
          name='ViewSearchScreen'
          component={SearchScreen}
          options={{
            headerTitle: i18n.t("menuTopSearch"),
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: Colors.white,
            headerTintColor: Colors.white,
            headerTitleAlign: "center",
          }}
          header={{
            style: styles.transparentHeader,
          }}
        />
      </SearchNavigation.Navigator>
    );
  }

  function favStackScreens({ navigation }) {
    return (
      <FavNavigation.Navigator initialRouteName='ViewFavScreen'>
        <FavNavigation.Screen
          name='ViewFavScreen'
          component={FavCitiesScreen}
          options={{
            headerTitle: i18n.t("menuTopFav"),
            headerShown: true,
            headerTransparent: true,
            headerTitleStyle: Colors.white,
            headerTintColor: Colors.white,
            headerTitleAlign: "center",
          }}
          header={{
            style: styles.transparentHeader,
          }}
        />
      </FavNavigation.Navigator>
    );
  }

  return (
    <MapNavigation.Navigator initialRouteName='ViewDefaultScreen'>
      <MapNavigation.Screen
        name='ViewDefaultScreen'
        component={DefaultNavigator}
        options={{
          headerShown: false,
        }}
      ></MapNavigation.Screen>
      <MapNavigation.Screen
        name='ViewCityScreen'
        component={CityScreen}
        options={{
          headerTitle: "",
          headerShown: true,
          headerTransparent: true,
          headerTitleStyle: Colors.white,
          headerTintColor: Colors.white,
          headerTitleAlign: "center",
        }}
        header={{
          style: styles.transparentHeader,
        }}
        tabBarVisible={false}
      />
    </MapNavigation.Navigator>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.userPreference.location,
    favCities: state.favCitiesReducer.favoriteCitiesIds,
  };
};

export default connect(mapStateToProps)(Navigation);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  bottomButton: {
    bottom: 0,
  },
  transparentHeader: {
    position: "absolute",
    backgroundColor: "transparent",
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
  },
});
