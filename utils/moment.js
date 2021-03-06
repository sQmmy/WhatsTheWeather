import moment from "moment";
import i18n from "i18n-js";

export const returnDate = (timestamp) => {
  return moment.unix(timestamp).format("DD/MM");
};

export const returnDateTime = (timestamp) => {
  return moment.unix(timestamp).format("DD/MM HH:mm");
};

export const returnHour = (timestamp, timezone_offset) => {
  return moment
    .unix(timestamp + timezone_offset)
    .subtract(1, "h")
    .format("HH:mm");
};

export const isADayAfter = (input) => {
  let date = moment.unix().add(1, "d");
  const dateToCheck = moment.unix(input);
  return dateToCheck.isAfter(date);
};

export const now = () => {
  return moment().format("DD/MM/YYYY HH:mm");
};

export const returnDayName = (timestamp) => {
  let day = moment.unix(timestamp).format("DD/MM/YYYY");
  if (day == moment().format("DD/MM/YYYY")) {
    return i18n.t("today");
  }
  if (day == moment().add(1, "days").format("DD/MM/YYYY")) {
    return i18n.t("tomorrow");
  }
  if (day == moment().subtract(1, "days").format("DD/MM/YYYY")) {
    return i18n.t("yesterday");
  }
  return i18n.t(moment.unix(timestamp).format("dddd").toLowerCase());
};
