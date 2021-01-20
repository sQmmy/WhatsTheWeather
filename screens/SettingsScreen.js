import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "../definitions/Colors.js";
import { connect } from "react-redux";
import { Picker } from "@react-native-picker/picker";

const SettingsScreen = ({ language, dispatch }) => {
  const changeLang = (itemValue) => {
    dispatch({ type: "CHANGE_LANGUAGE", value: itemValue });
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={language}
        style={{ height: 60, width: 150 }}
        onValueChange={(itemValue) => {
          changeLang(itemValue);
        }}
      >
        <Picker.Item label='🇫🇷 Français' value='fr' />
        <Picker.Item label='🇬🇧 English' value='en' />
      </Picker>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.userPreference.location,
  };
};

export default connect(mapStateToProps)(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnail: {
    height: 180,
    backgroundColor: Colors.mainGreen,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  errorImg: {
    height: 128,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: "white",
  },
  identityContainerTop: {
    marginTop: 5,
    padding: 12,
    borderRadius: 5,
    backgroundColor: "white",
    flexDirection: "row",
  },
  identityContainerBottom: {
    marginTop: 16,
    elevation: 1,
    borderRadius: 3,
    padding: 12,
    backgroundColor: "white",
  },
  identityRestaurant: {
    flex: 4,
  },
  name: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
  },
  reviewRestaurant: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerNote: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textNote: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  textMaxNote: {
    fontSize: 12,
    marginLeft: 3,
    color: "white",
  },
  title: {
    marginTop: 16,
    color: Colors.mainGreen,
    fontWeight: "bold",
  },
});
