import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Assets from "../definitions/Assets";
import Colors from "../definitions/Colors";

const DisplayError = ({ message = "Une erreur s'est produite" }) => (
  <View style={styles.container}>
    <Image source={Assets.icons.error} style={styles.icon} />
    <Text style={styles.errorText}>{message}</Text>
  </View>
);

export default DisplayError;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  icon: {
    tintColor: Colors.mainBlue,
  },
  errorText: {
    fontSize: 16,
  },
});
