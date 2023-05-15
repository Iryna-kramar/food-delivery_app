import { configureStore } from "@reduxjs/toolkit";
import menuItemsReducer from "../features/menuItems/menuItemsSlice";
import productsReducer from "../features/products/productsSlice";

const store = configureStore({
  reducer: {
    menuItems: menuItemsReducer,
    products: productsReducer,
  },
  devTools: true, 
});

export default store;
