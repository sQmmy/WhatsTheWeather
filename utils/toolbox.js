export const returnWeatherUnit = (unit) => {
  if (unit == "metric") {
    return "°C";
  }
  if (unit == "imperial") {
    return "°F";
  }
  if (unit == "standard") {
    return "°K";
  }
};

export const returnSpeedUnit = (value, unit) => {
  if (unit == "metric" || "standard") {
    let val = value * 3.6;
    return val + " km/h";
  }
  return value + " mls/h";
};

export const returnWindDirection = (degrees) => {
  var directionArray = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  var direction = Math.round(degrees / 45);
  return directionArray[direction];
};
