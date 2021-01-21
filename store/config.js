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

export const Store = createStore(reducerPersist);
export const Persistor = persistStore(Store);
