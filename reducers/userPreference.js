import { locale } from "expo-localization";

const initialState = { locale };

function userPreference(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case "CHANGE_LANGUAGE":
      nextState = {
        ...state,
        location: action.value,
      };
      return nextState || state;
    default:
      return state;
  }
}

export default userPreference;
