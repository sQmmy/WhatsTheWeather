import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Persistor, Store } from "./store/config";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./navigation/Navigation";

export default function App() {
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
