import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";


import sportReducer from "./sportReducer";
import CalendarReducer from "./CalendarReducer";
// Hier kannst du deine Reducer importieren
// import sportReducer from './reducers/sportReducer';

const rootReducer = combineReducers({
  // Hier fügst du deine Reducer hinzu
  sport: sportReducer,
  calendar: CalendarReducer,
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
