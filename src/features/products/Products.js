import React, { useState, useEffect, useRef, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "./productsSlice";
import { getToppings } from "./toppingsSlice";
import Product from "../../components/Product";
import { useNavigate, useLocation } from "react-router-dom";
import CartContext from '../../context/CartContext';
import { getQueryStringValue } from "../../utils/functions";
import ToppingsModal from "../../components/ToppingModal";
import Layout from "../../components/Layout";
import { addToCart, changeProductCount } from "../cart/cartSlice";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Products = () => {
  const dispatch = useDispatch();
  const { items, setItems } = useContext(CartContext);
  const products = useSelector((state) => state.products.data);
  const loading = useSelector((state) => state.products.isLoading);
  const failed = useSelector((state) => state.products.isFailed);
  const toppings = useSelector((state) => state.toppings.data);
  const cart = useSelector((state) => state.cart.data);

  const [category, setCategory] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [selectedToppingsCount, setSelectedToppingsCount] = useState(0);
  const [totalOrderPrice, setTotalOrderPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [cartProducts, setCartProducts] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { search = "" } = location;

  const emptyArrayRef = useRef([]);

  useEffect(() => {
    if (search) {
      const category = getQueryStringValue(search, "search");
      setCategory(category);
      dispatch(getAllProducts(category));
    }
  }, [category, dispatch]);

  useEffect(() => {
    setFilteredResults(products);
    console.log(filteredResults, "filteredResults");
  }, [products]);

  useEffect(() => {
    setCartProducts(cart);
  }, [cart]);

  useEffect(() => {
    dispatch(getToppings());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (cartProducts.length === 0 || items.length !== cartProducts.length) {
      setCartProducts(items);
      dispatch(addToCart(items));
    }
  }, []);

  useEffect(() => {
    if (!search) {
      navigate("/");
    }
  }, [search, navigate]);

  useEffect(() => {
    emptyArrayRef.current = new Array(toppings.length).fill(false);
    setCheckedState(emptyArrayRef.current);
  }, [toppings.length]);

  useEffect(() => {
    if (selectedProduct.price >= 0 && selectedToppingsCount > 0) {
      setTotalOrderPrice(selectedProduct.price + selectedProduct.productPrice);
    } else if (selectedProduct.price >= 0) {
      setTotalOrderPrice(selectedProduct.price);
    }
  }, [selectedProduct.price, selectedToppingsCount]);

  useEffect(() => {
    if (cart.length > 0) {
      setItems(cart);
    }
  }, [setItems, cart]);

  const toggleModal = (id, title, image, price) => {
    if (id) {
      setSelectedProduct({
        id,
        title,
        image,
        price,
        productPrice: price,
      });
      setModalTitle(title);
    }
    setShowModal(!showModal);
  };

  const resetState = () => {
    setSelectedProduct({});
    setCheckedState(emptyArrayRef.current);
    setProductQuantity(1);
    setSelectedToppingsCount(0);
    setTotalOrderPrice(0);
  };

  const addProduct = () => {
    const { id, title, image } = selectedProduct;

    let isAlreadyAdded = false;
    const isPizzaCategory = category === "pizza";
    let cart = cartProducts.map((cartProduct) => {
      if (cartProduct.id === id) {
        isAlreadyAdded = true;
        cartProduct.quantity = productQuantity;
        cartProduct.price = totalOrderPrice;
        cartProducts.category = category;
        if (isPizzaCategory) {
          cartProduct.toppings = checkedState
            .map((isChecked, index) =>
              isChecked ? toppings[index].name : null
            )
            .filter(Boolean);
        }
        return cartProduct;
      } else {
        return cartProduct;
      }
    });

    if (!isAlreadyAdded) {
      cart = [
        ...cart,
        {
          id,
          title,
          image,
          toppings: isPizzaCategory
            ? checkedState
                .map((isChecked, index) =>
                  isChecked ? toppings[index].name : null
                )
                .filter(Boolean)
            : null,
          quantity: productQuantity,
          price: totalOrderPrice,
          category,
        },
      ];

      if (isPizzaCategory) {
        // remove toppings from non-pizza category products
        cart = cart.map((item) => {
          if (
            (item.category === "pizza" && item.toppings.length > 0) ||
            item.category === "pizza"
          ) {
            return item;
          } else {
            delete item.toppings;
            return item;
          }
        });
      }
    }

    setCartProducts(cart);
    resetState();
    setShowModal(!showModal);
    dispatch(addToCart(cart));
    toast.success("Product added successfully.");
  };

  const addNormalProduct = (id, title, image, price) => {
    const cart = [
      ...cartProducts,
      {
        id,
        title,
        image,
        quantity: productQuantity,
        price,
        category,
      },
    ];
    setCartProducts(cart);
    dispatch(addToCart(cart));
    toast.success("Product added successfully.");
  };

  const handleToppingsSelection = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
    setSelectedToppingsCount(
      updatedCheckedState.filter((value) => value === true).length
    );

    const totalPrice = updatedCheckedState.reduce(
      (sum, currentState, index) => {
        if (currentState === true) {
          return sum + toppings[index].price;
        }
        return sum;
      },
      0
    );

    setSelectedProduct({
      ...selectedProduct,
      price: totalPrice,
    });
  };

  const handleQuantityChange = (operation) => {
    if (operation === "increment") {
      setProductQuantity(productQuantity + 1);
    } else if (operation === "decrement") {
      setProductQuantity(productQuantity > 1 ? productQuantity - 1 : 1);
    }
  };

  const handleFilterChange = () => {
    const isVeg = !selectedFilter;
    setSelectedFilter(isVeg);
    const result = isVeg
      ? products.filter((product) => product.is_veg === isVeg)
      : products;
    setFilteredResults(result);
  };

  const handleChangeProductCount = (id, operation) => {
    dispatch(changeProductCount(id, operation === 'increment'));
  };


  if (loading) {
    return (
      <div>
        <p className="loading">Loading...</p>
      </div>
    );
  }

  if (failed) {
    return (
      <div>
        <p className="error-msg">
          Error while loading products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <Layout cartCount={items.length}>
      {search ? (
        <div className="products">
          <div className="main-title">{category}</div>
          {category === "pizza" && (
            <div className="filters">
              <input
                type="checkbox"
                 id="filter"
                className="custom-checkbox"
                name="filter"
                value="veg-only"
                checked={selectedFilter}
                onChange={handleFilterChange}
              />{" "}
              <label htmlFor="filter">Veg only</label>
            </div>
          )}
          {filteredResults.map(
            ({
              _id,
              name,
              description,
              price,
              quantity,
              rating,
              image,
              is_veg,
            }) => (
              <Product
                key={_id}
                id={_id}
                title={name}
                description={description}
                price={price}
                quantity={quantity}
                rating={rating}
                image={image?.url}
                isVeg={is_veg}
                category={category}
                toggleModal={toggleModal}
                addNormalProduct={addNormalProduct}
                cart={cart}
                handleChangeProductCount={handleChangeProductCount}
              />
            )
          )}
        </div>
      ) : null}
      <ToppingsModal
        showModal={showModal}
        toggleModal={toggleModal}
        modalTitle={modalTitle}
        toppings={toppings}
        checkedState={checkedState}
        productQuantity={productQuantity}
        selectedToppingsCount={selectedToppingsCount}
        totalOrderPrice={totalOrderPrice}
        handleQuantityChange={handleQuantityChange}
        handleToppingsSelection={handleToppingsSelection}
        addProduct={addProduct}
      />
    </Layout>
  );
};

export default Products;
