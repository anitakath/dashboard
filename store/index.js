import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sportReducer from "./sportReducer";
import CalendarReducer from "./CalendarReducer";
import navigationReducer from "./navigationReducer";
import authReducer from "./authReducer";
import profileReducer from "./profileReducer";


const rootReducer = combineReducers({
  sport: sportReducer,
  calendar: CalendarReducer,
  navigation: navigationReducer,
  auth: authReducer,
  profile: profileReducer
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);


