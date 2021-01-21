import { locale } from "expo-localization";

const initialState = { location: locale, unit: "metric" };

function userPreference(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case "CHANGE_LANGUAGE":
      nextState = {
        ...state,
        location: action.value,
      };
      return nextState || state;
    case "CHANGE_UNITS":
      nextState = {
        ...state,
        unit: action.value,
      };
      return nextState || state;
    default:
      return state;
  }
}

export default userPreference;
