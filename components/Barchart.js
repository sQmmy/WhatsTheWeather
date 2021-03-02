import { BarChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import i18n from "i18n-js";
import { connect } from "react-redux";
import React from "react";

const Barchart = ({ language, unit, barChartData }) => {
  const hiddenIndexes = [
    1,
    2,
    4,
    5,
    7,
    8,
    10,
    11,
    13,
    14,
    16,
    17,
    19,
    20,
    22,
    23,
    25,
    26,
    28,
    29,
    31,
    32,
    34,
    35,
    37,
    38,
    40,
    41,
    43,
    44,
    46,
    47,
  ];
  return (
    <LinearGradient
      colors={["#65a1e79c", "#65a1e79c", "#65a1e7de"]}
      style={{ borderRadius: 16, marginTop: 6 }}
    >
      <View style={styles.chartContainer}>
        <View style={styles.chartTopContainer}>
          <Text style={styles.containerTitle}>{i18n.t("humidityTitle")}</Text>
        </View>
        <View style={styles.chartContentContainer}>
          {barChartData != null ? (
            <ScrollView horizontal={true}>
              <BarChart
                data={barChartData}
                width={
                  Dimensions.get("window").width *
                    0.07 *
                    barChartData.datasets[0].data.length -
                  12
                }
                height={220}
                fromZero={true}
                showValuesOnTopOfBars={true}
                hidePointsAtIndex={hiddenIndexes}
                withInnerLines={true}
                withHorizontalLabels={false}
                colors={["#65a1e79c", "#65a1e79c", "#65a1e7de"]}
                chartConfig={{
                  propsForLabels: {
                    strokeWidth: 12,
                    fontSize: 8,
                    fontStyle: "italic",
                  },
                  backgroundGradientFrom: "#65a1e79c",
                  backgroundGradientTo: "#65a1e7de",
                  barPercentage: 0.5,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderBottomRightRadius: 16,
                    borderBottomLeftRadius: 16,
                  },
                }}
                style={{
                  borderRadius: 16,
                  paddingRight: 16,
                }}
              />
            </ScrollView>
          ) : (
            <View style={styles.loader}>
              <ActivityIndicator color={"white"} size='large' />
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const mapStateToProps = (state) => {
  return {
    favCities: state.favCitiesReducer.favoriteCitiesIds,
    language: state.userPreference.location,
    unit: state.userPreference.unit,
  };
};

export default connect(mapStateToProps)(Barchart);

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  chartContainer: {
    height: 300,
    justifyContent: "center",
    width: 1200,
    alignSelf: "center",
    marginTop: 16,
  },
  containerTitle: {
    color: "#ffffffb3",
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartContainer: {
    height: 240,
    marginTop: 16,
  },
  chartTopContainer: {
    height: 20,
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 12,
  },
  chartContentContainer: {
    justifyContent: "center",
  },
});
