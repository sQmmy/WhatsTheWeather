import { combineReducers, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import favCitiesReducer from "../reducers/favCities";
import userPreference from "../reducers/userPreference";

const configPersist = {
  key: "root",
  storage: AsyncStorage,
};

const appReducer = combineReducers({
  favCitiesReducer,
  userPreference,
});

const reducerPersist = persistReducer(configPersist, appReducer);

const rootReducer = (state, action) => {
  if (action.type === "RESTORE_APP") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const Store = createStore(reducerPersist);
export const Persistor = persistStore(Store);
export default rootReducer;
