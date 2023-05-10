import { configureStore } from "@reduxjs/toolkit";
import menuItemsReducer from "../features/menuItems/menuItemsSlice";
import productsReducer from "../features/products/productsSlice";

export default configureStore({
  reducer: {
    menuItems: menuItemsReducer,
    products: productsReducer,
  },
});


