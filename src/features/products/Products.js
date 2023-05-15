import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "./productsSlice";
import Product from "../../components/Product";
import { useNavigate, useLocation } from "react-router-dom";
import { getQueryStringValue } from '../../utils/functions';

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.data);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);

  const [category, setCategory] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { search = "" } = location;

  useEffect(() => {
    if (search) {
      const category = getQueryStringValue(search, 'search');
      setCategory(category);
      dispatch(getAllProducts(category));
    }
  }, [category, dispatch]);

  useEffect(() => {
    setFilteredResults(products);
    console.log(filteredResults, 'filteredResults')
  }, [products]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <React.Fragment>
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
              />
            )
          )}
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default Products;
