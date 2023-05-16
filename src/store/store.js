import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import menuItemsReducer from "../features/menuItems/menuItemsSlice";
import productsReducer from "../features/products/productsSlice";
import toppingsReducer from "../features/products/toppingsSlice";

const store = configureStore({
  reducer: {
    root: rootReducer,
    menuItems: menuItemsReducer,
    products: productsReducer,
    toppings: toppingsReducer,
  },
  devTools: true,
});

export default store;
