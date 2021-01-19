import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "../components/Search";
import Assets from "../definitions/Assets";
import Colors from "../definitions/Colors";
import { Image, StyleSheet, View } from "react-native";
import City from "../components/City";
import FavCities from "../components/FavCities";
import * as Localization from "expo-localization";
import { Picker } from "@react-native-picker/picker";
import { connect } from "react-redux";
import i18n from "i18n-js";

const SearchNavigation = createStackNavigator();
const FavNavigation = createStackNavigator();
const TabNavigation = createBottomTabNavigator();

const Navigation = ({ language, dispatch }) => {
  i18n.translations = {
    fr: require("../locales/fr.json"),
    en: require("../locales/en.json"),
  };

  i18n.locale = language || Localization.locale;
  i18n.fallbacks = true;

  function searchStackScreens() {
    return (
      <SearchNavigation.Navigator initialRouteName="ViewSearch">
        <SearchNavigation.Screen
          name="ViewSearch"
          component={Search}
          options={{
            headerTitle: i18n.t("menuTopSearch"),
            headerRight: () => (
              <View style={styles.buttonPlacement}>
                <Picker
                  selectedValue={language}
                  style={{ height: 60, width: 150 }}
                  onValueChange={(itemValue) => {
                    dispatch({ type: "CHANGE_LANGUAGE", value: itemValue });
                  }}
                >
                  <Picker.Item label="🇫🇷 Français" value="fr" />
                  <Picker.Item label="🇬🇧 English" value="en" />
                </Picker>
              </View>
            ),
          }}
        />
        <SearchNavigation.Screen
          name="ViewCity"
          component={City}
          options={{ title: i18n.t("menuTopCity") }}
        />
      </SearchNavigation.Navigator>
    );
  }

  function favStackScreens() {
    return (
      <FavNavigation.Navigator initialRouteName="ViewFav">
        <FavNavigation.Screen
          name="ViewFav"
          component={FavCities}
          options={{ title: i18n.t("menuTopFav") }}
        />
        <FavNavigation.Screen
          name="ViewCity"
          component={City}
          options={{ title: i18n.t("menuTopCity") }}
        />
      </FavNavigation.Navigator>
    );
  }

  return (
    <TabNavigation.Navigator
      tabBarOptions={{
        activeTintColor: Colors.mainGreen,
      }}
    >
      <TabNavigation.Screen
        name={i18n.t("menuBottomSearch")}
        component={searchStackScreens}
        options={() => ({
          tabBarIcon: ({ color }) => {
            return (
              <Image
                source={Assets.icons.search}
                style={{ tintColor: color }}
              />
            );
          },
        })}
      />
      <TabNavigation.Screen
        name={i18n.t("menuBottomFav")}
        component={favStackScreens}
        options={() => ({
          tabBarIcon: ({ color }) => {
            return (
              <Image source={Assets.icons.fav} style={{ tintColor: color }} />
            );
          },
        })}
      />
    </TabNavigation.Navigator>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.userPreference.location,
  };
};

export default connect(mapStateToProps)(Navigation);

const styles = StyleSheet.create({
  buttonPlacement: {
    flex: 1,
    paddingHorizontal: 12,
    marginRight: 16,
  },
});
