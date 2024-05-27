import { combineReducers, configureStore } from "@reduxjs/toolkit";
import walletReducer from "./slices/wallet";

import { setupListeners } from "@reduxjs/toolkit/query";

const rootReducer = combineReducers({
  walletReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: {
      rootReducer,
    },
  });
};

export const store = makeStore();

setupListeners(store.dispatch);
