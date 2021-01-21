import moment from "moment";
import i18n from "i18n-js";

export const returnDate = (timestamp) => {
  return moment.unix(timestamp).format("DD/M");
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
  return i18n.t(moment.unix(timestamp).format("dddd").toLowerCase());
};
