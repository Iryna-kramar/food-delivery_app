import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import MenuItems from "./features/menuItems/MenuItems";
import Products from "./features/products/Products";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/menu" element={<MenuItems />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </div>
  );
}

export default App;
