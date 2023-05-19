import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (products) => {
    try {
      return products;
    } catch (error) {
      throw error;
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (id) => {
    try {
      return id;
    } catch (error) {
      throw error;
    }
  }
);

export const setCart = createAsyncThunk("cart/setCart", async (products) => {
  try {
    return products;
  } catch (error) {
    throw error;
  }
});

export const changeProductCount = createAsyncThunk(
  "cart/changeProductCount",
  async ({ id, isIncrement }) => {
    try {
      return { id, isIncrement };
    } catch (error) {
      console.log("error while changing product count");
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    isLoading: false,
    isFailed: false,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.isFailed = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFailed = false;
        state.data = action.payload;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.isFailed = true;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.isFailed = false;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFailed = false;
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state) => {
        state.isLoading = false;
        state.isFailed = true;
      })
      .addCase(setCart.pending, (state) => {
        state.isLoading = true;
        state.isFailed = false;
      })
      .addCase(setCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFailed = false;
        state.data = action.payload;
      })
      .addCase(setCart.rejected, (state) => {
        state.isLoading = false;
        state.isFailed = true;
      })
      .addCase(changeProductCount.pending, (state) => {
        state.isLoading = true;
        state.isFailed = false;
      })
      .addCase(changeProductCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isFailed = false;
        const { id, isIncrement } = action.payload;
        state.data = state.data.map((item) => {
          if (item.id === id) {
            if (isIncrement) {
              return {
                ...item,
                quantity: item.quantity + 1,
              };
            } else if (item.quantity > 1) {
              return {
                ...item,
                quantity: item.quantity - 1,
              };
            }
          }
          return item;
        });
      })
      .addCase(changeProductCount.rejected, (state) => {
        state.isLoading = false;
        state.isFailed = true;
      });
  },
});

export default cartSlice.reducer;
