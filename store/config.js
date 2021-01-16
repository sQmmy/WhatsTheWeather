import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";
import favCitiesReducer from "../reducers/favCities";

const configPersist = {
  key: "root",
  storage: AsyncStorage,
};

const reducerPersist = persistReducer(configPersist, favCitiesReducer);

export const Store = createStore(reducerPersist);
export const Persistor = persistStore(Store);
