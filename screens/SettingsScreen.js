import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import i18n from "i18n-js";
import AlertAsync from "react-native-alert-async";
import { FontAwesome } from "@expo/vector-icons";

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  changeLang = (lng) => {
    this.props.dispatch({ type: "CHANGE_LANGUAGE", value: lng });
  };

  changeUnits = (unit) => {
    this.props.dispatch({ type: "CHANGE_UNITS", value: unit });
  };

  restoreApp = (unit) => {
    this.props.dispatch({ type: "RESTORE_APP", value: unit });
  };

  onLanguageChange = async (lng) => {
    if (lng != this.props.language) {
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
        this.changeLang(lng);
      }
    }
  };

  onResetApp = async () => {
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
      this.restoreApp();
    }
  };

  render() {
    const { language, units } = this.props;
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
                  this.onLanguageChange(itemValue);
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
                  this.changeUnits(lng);
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
              this.onResetApp();
            }}
          >
            <View style={styles.parameter}>
              <View style={styles.parameterLabelContainer}>
                <Text style={styles.parameterLabel}>
                  {i18n.t("paramReset")}
                </Text>
              </View>
              <FontAwesome
                name='trash'
                color={"black"}
                style={styles.iconInput}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

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
    marginTop: 16,
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
