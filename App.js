import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor, Store } from "./store/config";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./navigation/Navigation";
import * as SplashScreen from "expo-splash-screen";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import i18n from "i18n-js";
import { enableScreens } from "react-native-screens";
export default class App extends React.Component {
  state = {
    appIsReady: false,
    fadeTextAnimation: new Animated.Value(0),
    imageSize: new Animated.Value(1),
    imageOpacity: new Animated.Value(4),
  };

  breathAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.imageSize, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(this.state.imageSize, {
          toValue: 0.95,
          duration: 500,
          easing: Easing.in(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  fadeIn = () => {
    Animated.timing(this.state.fadeTextAnimation, {
      toValue: 4,
      useNativeDriver: true,
      duration: 2000,
      delay: 500,
    }).start(() => {
      this.fadeOut();
    });
    this.breathAnimation();
  };

  imageFadeOut = () => {
    Animated.timing(this.state.imageOpacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 2000,
    }).start();
  };

  fadeOut = () => {
    Animated.timing(this.state.fadeTextAnimation, {
      toValue: 0,
      useNativeDriver: true,
      duration: 2000,
    }).start(() => {
      this.onAnimationFinished();
    });
    this.imageFadeOut();
  };

  onAnimationFinished = () => {
    this.setState({ appIsReady: true }, async () => {
      await SplashScreen.hideAsync();
    });
  };

  async componentDidMount() {
    try {
      enableScreens();
      await SplashScreen.preventAutoHideAsync();
      this.fadeIn();
    } catch (e) {
      console.warn(e);
    }
  }

  render() {
    if (!this.state.appIsReady) {
      return (
        <View style={styles.splashTopContainer}>
          <View style={styles.splashContainer}>
            <Animated.Image
              style={[
                styles.splashScreen,
                {
                  opacity: this.state.imageOpacity,
                  transform: [{ scale: this.state.imageSize }],
                },
              ]}
              source={require("./assets/cloudy.png")}
            />
          </View>
          <Animated.View
            style={[
              {
                opacity: this.state.fadeTextAnimation,
              },
            ]}
          >
            <Text style={styles.appTitle}>{i18n.t("appName")}</Text>
          </Animated.View>
          <Animated.View
            style={[
              {
                opacity: this.state.fadeTextAnimation,
              },
            ]}
          >
            <Text style={styles.appMessage}>{i18n.t("welcomeMessageApp")}</Text>
          </Animated.View>
          <View style={styles.authorContainer}>
            <Animated.View
              style={[
                {
                  opacity: this.state.fadeTextAnimation,
                },
              ]}
            >
              <Text style={styles.authorChild}>{i18n.t("authorName")}</Text>
            </Animated.View>
            <Animated.View
              style={[
                {
                  opacity: this.state.fadeTextAnimation,
                },
              ]}
            >
              <Text style={styles.authorChild}>{i18n.t("courseName")}</Text>
            </Animated.View>
          </View>
        </View>
      );
    } else {
      return (
        <Provider store={Store}>
          <PersistGate loading={null} persistor={Persistor}>
            <NavigationContainer>
              <Navigation />
              <StatusBar style='auto' />
            </NavigationContainer>
          </PersistGate>
        </Provider>
      );
    }
  }
}

const styles = StyleSheet.create({
  splashScreen: { width: "100%", height: "100%", resizeMode: "contain" },
  splashContainer: {
    width: 200,
    height: 150,
  },
  authorContainer: {
    bottom: 30,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  authorChild: {
    fontSize: 16,
    color: "white",
    textShadowOffset: { width: 2, height: 2 },
    fontWeight: "bold",
    marginHorizontal: 20,
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
    fontSize: 18,
    color: "white",
  },
});
