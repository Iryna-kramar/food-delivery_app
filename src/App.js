import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import MenuItems from "./features/menuItems/MenuItems";
import Products from "./features/products/Products";
import useLocalStorage from "./hooks/useLocalStorage";
import CartContext from "./context/CartContext";
import Cart from "./features/cart/Cart";

function App() {
  const [items, setItems] = useLocalStorage("cartItems", []);

  return (
    <div>
      <CartContext.Provider value={{ items, setItems }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/menu" element={<MenuItems />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </CartContext.Provider>
    </div>
  );
}

export default App;
