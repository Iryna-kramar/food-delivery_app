import React, {useEffect, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import CartContext from '../context/CartContext';
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../features/cart/cartSlice";


const Header = ({ showCart = false, cartCount = 0 }) => {
  const { items } = useContext(CartContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setCart(items));
  }, []);

  const displayStyle = { display: `${showCart ? "block" : "none"}` };

  const handleRedirect = () => {
    navigate("/cart");
  };

  return (
    <nav>
      <header className="navigation-bar">
        <div className="home-link">
          <Link to="/">
            <h1>Food Market</h1>
          </Link>
        </div>
        <div
          className="cart-icon"
          style={displayStyle}
          onClick={handleRedirect}
        >
          <FiShoppingCart size="30" color="green" className="cart-logo" />
          <span className="cart-count">{cartCount}</span>
        </div>
        <div className="menu-link" style={displayStyle}>
          <Link to="/menu">Available Menus</Link>
        </div>
      </header>
    </nav>
  );
};

export default Header;
