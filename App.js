import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor, Store } from "./store/config";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./navigation/Navigation";
import * as SplashScreen from "expo-splash-screen";
import { enableScreens } from "react-native-screens";
export default class App extends React.Component {
  state = {
    appIsReady: false,
  };

  async componentDidMount() {
    try {
      enableScreens();
      await SplashScreen.preventAutoHideAsync();
    } catch (e) {
      console.warn(e);
    }
    this.timer();
  }

  timer = async () => {
    try {
      setTimeout(function () {}, 1000);
    } catch (e) {
      console.warn(e);
    } finally {
      this.setState({ appIsReady: true }, async () => {
        await SplashScreen.hideAsync();
      });
    }
  };

  render() {
    if (!this.state.appIsReady) {
      return null;
    }

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
