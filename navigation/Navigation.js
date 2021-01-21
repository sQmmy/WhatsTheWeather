import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { SafeAreaView, StyleSheet, View } from "react-native";
import * as Localization from "expo-localization";
import { connect } from "react-redux";
import i18n from "i18n-js";
import { FontAwesome } from "@expo/vector-icons";
import CityScreen from "../screens/CityScreen";
import FavCitiesScreen from "../screens/FavCitiesScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Colors from "../definitions/Colors";

const SearchNavigation = createStackNavigator();
const DrawerNavigation = createDrawerNavigator();

const Navigation = ({ language }) => {
  i18n.translations = {
    fr: require("../locales/fr.json"),
    en: require("../locales/en.json"),
  };

  i18n.locale = language || Localization.locale;
  i18n.fallbacks = true;

  const NavigationDrawerStructure = (props) => {
    const toggleDrawer = () => {
      props.navigationProps.toggleDrawer();
    };

    return (
      <View style={{ flexDirection: "row" }}>
        <FontAwesome.Button
          onPress={() => toggleDrawer()}
          name='bars'
          backgroundColor={"transparent"}
          color={"white"}
          style={{ marginLeft: 8 }}
        ></FontAwesome.Button>
      </View>
    );
  };

  function searchStackScreens({ navigation }) {
    return (
      <SearchNavigation.Navigator initialRouteName='ViewSearchScreen'>
        <SearchNavigation.Screen
          name='ViewSearchScreen'
          component={SearchScreen}
          options={{
            headerLeft: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
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
        <SearchNavigation.Screen
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
        />
        <SearchNavigation.Screen
          name='ViewSettingsScreen'
          component={SettingsScreen}
          options={{
            headerTitle: i18n.t("menuTopSettings"),
          }}
        />
        <SearchNavigation.Screen
          name='ViewFavScreen'
          component={FavCitiesScreen}
          options={{
            headerTitle: i18n.t("menuTopFav"),
            headerLeft: () => (
              <NavigationDrawerStructure navigationProps={navigation} />
            ),
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

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.container}
      >
        <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
          <DrawerItem
            icon={() => getIcon("search")}
            label={i18n.t("menuTopSearch")}
            onPress={() => props.navigation.navigate("ViewSearchScreen")}
          />
          <DrawerItem
            icon={() => getIcon("star")}
            label={i18n.t("menuTopFav")}
            onPress={() => props.navigation.navigate("ViewFavScreen")}
          />
        </SafeAreaView>
        <DrawerItem
          icon={() => getIcon("gear")}
          label={i18n.t("menuTopSettings")}
          onPress={() => props.navigation.navigate("ViewSettingsScreen")}
          style={styles.bottomButton}
        />
      </DrawerContentScrollView>
    );
  }

  const getIcon = (icon_name) => {
    return (
      <FontAwesome.Button
        name={icon_name}
        backgroundColor={"white"}
        color={"black"}
        style={{ marginLeft: 8 }}
      ></FontAwesome.Button>
    );
  };

  return (
    <DrawerNavigation.Navigator
      drawerType={"slide"}
      drawerContentOptions={{
        activeTintColor: "#6441d8",
        itemStyle: { marginVertical: 5 },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName={i18n.t("menuBottomSearch")}
    >
      <DrawerNavigation.Screen
        name={i18n.t("menuBottomSearch")}
        options={{ drawerLabel: i18n.t("menuBottomSearch") }}
        component={searchStackScreens}
      />
    </DrawerNavigation.Navigator>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.userPreference.location,
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
