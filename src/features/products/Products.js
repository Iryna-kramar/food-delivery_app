import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "./productsSlice";
import { getToppings } from "./toppingsSlice";
import Product from "../../components/Product";
import { useNavigate, useLocation } from "react-router-dom";
import { getQueryStringValue } from "../../utils/functions";
import ToppingsModal from "../../components/ToppingModal";
import Layout from "../../components/Layout";

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.data);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const toppings = useSelector((state) => state.toppings.toppings);

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

  const navigate = useNavigate();
  const location = useLocation();
  const { search = "" } = location;

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
    dispatch(getToppings());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const addProduct = () => {
    const { id, title, image } = selectedProduct;
    console.log({ selectedProduct });
    setShowModal(!showModal);
    // toast.success('Product added successfully.');
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

  useEffect(() => {
    if (!search) {
      navigate("/");
    }
  }, [search, navigate]);

  if (loading) {
    return (
      <div>
        <p className="loading">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="error-msg">
          Error while loading products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <Layout>
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
