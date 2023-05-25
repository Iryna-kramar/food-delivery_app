import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";
import { TiDelete } from "react-icons/ti";
import { removeFromCart } from "../cart/cartSlice";
import { getFormattedPrice, getFormattedToppings } from "../../utils/functions";
import Layout from "../../components/Layout";
import { getAllProducts } from "../products/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { CURRENCY } from "../../utils/constants";

const Cart = () => {
  const { items, setItems } = useContext(CartContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.products.data);
  const cart = useSelector((state) => state.cart.data);
  const failed = useSelector((state) => state.products.isFailed);
  const cartActionType = useSelector((state) => state.cart.actionType);

  const [cartProducts, setCartProducts] = useState(() => cart);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    dispatch(getAllProducts());
  }, []);

  useEffect(() => {
    if (failed) {
      setErrorMsg("Something went wrong. Try again later.");
    } else {
      setErrorMsg("");
    }
  }, [failed]);

  useEffect(() => {
    if (cart.length === 0 || items.length !== cart.length) {
      if (items.length > cart.length) {
        setCartProducts(items);
      } else {
        setCartProducts(cart);
      }
    }
  }, []);

  const removeItemFromCart = (id) => {
    dispatch(removeFromCart(id));
    if (cartActionType === "fulfilled") {
      const filteredProducts = cartProducts.filter((item) => item.id !== id);
      setItems(filteredProducts);
      setCartProducts(filteredProducts);
    }
  };

  const doCheckout = (event) => {
    event.preventDefault();
    const oosItems = [];
    cart.forEach((cartItem) => {
      const item = products.find((product) => product.id === cartItem.id);
      if (item.quantity === 0) {
        oosItems.push(item.name);
      }
    });
    if (oosItems.length === 0) {
      setErrorMsg("");
      navigate("/checkout");
    } else {
      setErrorMsg(
        `${oosItems.join(", ")} ${
          oosItems.length > 1 ? "are" : "is"
        } out of stock. Please remove to proceed.`
      );
    }
  };

  return (
    <Layout cartCount={items.length}>
      <div className="main-title">Shopping Cart</div>
      {cartProducts.length > 0 ? (
        <React.Fragment>
          {errorMsg !== "" && <p className="oosMsg">{errorMsg}</p>}
          <div className="shopping-cart">
            <ul className="cart-items">
              {cartProducts.map(
                (
                  {
                    id,
                    title,
                    quantity,
                    image,
                    price,
                    toppings = [],
                    category,
                  },
                  index
                ) => {
                  let formattedToppings = [];
                  const isPizzaCategory = category === "pizza";
                  if (isPizzaCategory) {
                    formattedToppings = getFormattedToppings(toppings);
                  }
                  return (
                    <li key={index} className="cart-item">
                      <div>
                        <img src={image} alt={title} className="cart-img" />
                      </div>
                      <div className="p-top flex-grow-1 product-info">
                        <h6>{title}</h6>
                        {isPizzaCategory ? (
                          formattedToppings.length > 0 ? (
                            <p>
                              <span style={{ fontWeight: "500" }}>
                                Toppings:
                              </span>{" "}
                              <span className="selected-toppings">
                                {formattedToppings.join(", ")}
                              </span>
                            </p>
                          ) : (
                            <p>
                              <span style={{ fontWeight: "500" }}>
                                Toppings:
                              </span>{" "}
                              Not selected
                            </p>
                          )
                        ) : null}
                      </div>
                      <div className="p-top qty">Qty: {quantity}</div>
                      <div className="p-top price">
                        {CURRENCY} {price.toFixed(2)}
                      </div>
                      <div className="p-top">
                        <TiDelete
                          color="#000"
                          size="25"
                          className="delete-item"
                          onClick={() => removeItemFromCart(id)}
                        />
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
            <div className="cart-summary">
              <div className="summary-header">
                <h6>Order Summary</h6>
              </div>
              <div>
                <div>Number of items</div> <div>{cartProducts.length}</div>
              </div>
              <div className="summary-total">
                <div>Total amount</div>
                <div>
                  {getFormattedPrice(
                    cartProducts.reduce((sum, item) => {
                      return sum + item.price * item.quantity;
                    }, 0)
                  )}
                </div>
              </div>
              <div>
                <a
                  href="/#"
                  onClick={doCheckout}
                  className="action-btn checkout-btn"
                >
                  Checkout
                </a>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div className="shopping-cart">
          <p className="no-items">Your shopping cart is currently empty.</p>
        </div>
      )}
    </Layout>
  );
};

export default Cart;
