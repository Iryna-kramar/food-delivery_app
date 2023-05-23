import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import MenuItems from "./features/menuItems/MenuItems";
import Products from "./features/products/Products";
import useLocalStorage from "../src/hooks/useLocalStorage";

function App() {
  const [items, setItems] = useLocalStorage("cartItems", []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/menu" element={<MenuItems />} />
        <Route
          path="/products"
          element={<Products items={items} setItems={setItems} />}
        />
      </Routes>
    </div>
  );
}

export default App;
