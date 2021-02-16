import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Linking,
  Button,
} from "react-native";
import { connect } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import i18n from "i18n-js";
import AlertAsync from "react-native-alert-async";
import {
  FontAwesome,
  Foundation,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

const SettingsScreen = ({ language, units, dispatch }) => {
  const [stopTouchingMe, setStopTouchingMe] = useState(false);
  const [stopTouchingMeCpt, setStopTouchingMeCpt] = useState(0);

  useEffect(() => {
    if (stopTouchingMeCpt > 5) {
      setStopTouchingMe(true);
    }
  }, [stopTouchingMeCpt]);

  const changeLang = (lng) => {
    dispatch({ type: "CHANGE_LANGUAGE", value: lng });
  };

  const changeUnits = (unit) => {
    dispatch({ type: "CHANGE_UNITS", value: unit });
  };

  const restoreApp = (unit) => {
    dispatch({ type: "RESTORE_APP", value: unit });
  };

  const onLanguageChange = async (lng) => {
    if (lng != language) {
      const choice = await AlertAsync(
        i18n.t("alertTitle"),
        i18n.t("alertLngMessage"),
        [
          { text: i18n.t("yes"), onPress: () => "yes" },
          { text: i18n.t("no"), onPress: () => Promise.resolve("no") },
        ],
        {
          cancelable: true,
          onDismiss: () => "no",
        }
      );

      if (choice === "yes") {
        changeLang(lng);
      }
    }
  };

  const onResetApp = async () => {
    const choice = await AlertAsync(
      i18n.t("alertTitle"),
      i18n.t("areYouSure") + " " + i18n.t("alertResetMessage"),
      [
        { text: i18n.t("yes"), onPress: () => "yes" },
        { text: i18n.t("no"), onPress: () => Promise.resolve("no") },
      ],
      {
        cancelable: true,
        onDismiss: () => "no",
      }
    );

    if (choice === "yes") {
      restoreApp();
    }
  };

  const incrementCounter = () => {
    setStopTouchingMeCpt(stopTouchingMeCpt + 1);
  };

  const handleChangeState = (event) => {
    if (event == "ended") {
      setStopTouchingMe(false);
      setStopTouchingMeCpt(0);
    }
  };

  const OpenURLButton = ({ url, children }) => {
    const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
      }
    }, [url]);

    return (
      <MaterialCommunityIcons
        name={children}
        size={36}
        color='black'
        onPress={handlePress}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.parameters}>
        <View style={styles.parameter}>
          <View style={styles.parameterLabelContainer}>
            <Text style={styles.parameterLabel}>{i18n.t("paramLng")}</Text>
          </View>
          <View style={styles.paramInput}>
            <Picker
              selectedValue={language}
              style={styles.picker}
              onValueChange={(itemValue) => {
                onLanguageChange(itemValue);
              }}
            >
              <Picker.Item label='Français' value='fr' />
              <Picker.Item label='English' value='en' />
            </Picker>
          </View>
        </View>
        <View style={styles.parameter}>
          <View style={styles.parameterLabelContainer}>
            <Text style={styles.parameterLabel}>{i18n.t("paramUnits")}</Text>
          </View>
          <View style={styles.paramInput}>
            <Picker
              selectedValue={units}
              style={styles.picker}
              onValueChange={(lng) => {
                changeUnits(lng);
              }}
            >
              <Picker.Item label={i18n.t("paramMetric")} value='metric' />
              <Picker.Item label={i18n.t("paramStandard")} value='standard' />
              <Picker.Item label={i18n.t("paramImperial")} value='imperial' />
            </Picker>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            onResetApp();
          }}
        >
          <View style={styles.parameter}>
            <View style={styles.parameterLabelContainer}>
              <Text style={styles.parameterLabel}>{i18n.t("paramReset")}</Text>
            </View>
            <FontAwesome
              name='trash'
              color={"black"}
              style={styles.iconInput}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            incrementCounter();
          }}
        >
          {stopTouchingMe ? (
            <View style={styles.modal}>
              <YoutubePlayer
                height={250}
                videoId={"nQvdCxuqekc"}
                play={true}
                forceAndroidAutoplay={true}
                onChangeState={(event) => {
                  handleChangeState(event);
                }}
              />
            </View>
          ) : (
            <View style={styles.parameter}>
              <View style={styles.parameterLabelContainer}>
                <Text style={styles.parameterLabel}>Version</Text>
              </View>
              <Text style={{ marginHorizontal: 16 }}>1.0</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.contactContainer}>
        <OpenURLButton
          url={"https://github.com/sQmmy/WhatsTheWeather"}
          children={"github"}
        ></OpenURLButton>
        <OpenURLButton
          url={"mailto:geoffrey.0597@gmail.com"}
          children={"gmail"}
        ></OpenURLButton>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.userPreference.location,
    units: state.userPreference.unit,
  };
};

export default connect(mapStateToProps)(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    marginTop: 100,
    justifyContent: "space-between",
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  parameters: {
    flex: 1,
  },
  parameter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e9e7e7",
    height: 40,
  },
  paramLabelContainer: { flex: 1, flexDirection: "row" },
  parameterLabel: { fontSize: 18 },
  paramInput: {
    marginTop: -18,
    marginLeft: 10,
  },
  iconInput: {
    fontSize: 24,
    marginHorizontal: 16,
  },
  picker: {
    height: 60,
    width: 140,
  },
});
