import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllProducts = createAsyncThunk(
  "products/getAllProducts",
  async (category) => {
    try {
      let result;
      const { data: products } = await axios.get("/products.json");

      if (category) {
        result = products.filter(
          (product) =>
            product.categories.cat_title.toLowerCase() ===
            category.toLowerCase()
        );
      } else {
        result = products;
      }

      return result;
    } catch (error) {
      throw new Error("Failed to fetch products by category");
    }
  }
);

// const productsSlice = createSlice({
//   name: "products",
//   initialState: {
//     data: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getAllProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getAllProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(getAllProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

const productsSlice = createSlice({
  name: "products",
  initialState: {
    isLoading: false,
    isFailed: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isFailed = false;
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(getAllProducts.rejected, (state) => {
        state.isFailed = true;
        state.isLoading = false;
      });
  },
});

export default productsSlice.reducer;
