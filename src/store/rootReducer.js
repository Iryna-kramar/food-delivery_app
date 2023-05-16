import { combineReducers } from "redux";
import productsReducer from "../features/products/productsSlice";
import menuItemsReducer from "../features/menuItems/menuItemsSlice";
import toppingsReducer from "../features/products/toppingsSlice";

const rootReducer = combineReducers({
  products: productsReducer,
  menuItems: menuItemsReducer,
  toppings: toppingsReducer,
});

export default rootReducer;
