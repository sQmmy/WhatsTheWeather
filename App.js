import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor, Store } from "./store/config";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./navigation/Navigation";
import * as SplashScreen from "expo-splash-screen";
import { Image, StyleSheet, Text, View } from "react-native";
import i18n from "i18n-js";

export default class App extends React.Component {
  state = {
    appIsReady: false,
  };

  async componentDidMount() {
    // Prevent native splash screen from autohiding
    try {
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    this.prepareResources();
  }

  /**
   * Method that serves to load resources and make API calls
   */
  prepareResources = async () => {
    try {
      setTimeout(() => {
        this.setState({ appIsReady: true }, async () => {
          await SplashScreen.hideAsync();
        });
      }, 5000);
    } catch (e) {
      console.warn(e);
    }
  };

  render() {
    if (!this.state.appIsReady) {
      return (
        <View style={styles.splashTopContainer}>
          <View style={styles.splashContainer}>
            <Image
              source={require("./assets/cloudy.png")}
              style={styles.splashScreen}
            />
          </View>
          <Text style={styles.appTitle}>{i18n.t("appName")}</Text>
          <Text style={styles.appMessage}>{i18n.t("welcomeMessageApp")}</Text>
        </View>
      );
    }

    return (
      <Provider store={Store}>
        <PersistGate loading={null} persistor={Persistor}>
          <NavigationContainer>
            <Navigation />
            <StatusBar style="auto" />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  splashScreen: { width: "100%", height: "100%", resizeMode: "contain" },
  splashContainer: {
    width: 200,
    height: 150,
  },
  splashTopContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#3981ad",
  },
  appTitle: {
    fontWeight: "bold",
    fontSize: 36,
    textShadowColor: "#000000",
    textShadowRadius: 10,
    textShadowOffset: { width: 2, height: 2 },
    color: "white",
  },
  appMessage: {
    fontStyle: "italic",
    fontSize: 16,
    color: "white",
  },
});
