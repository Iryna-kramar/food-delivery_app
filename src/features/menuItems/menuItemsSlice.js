import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isFailed: false,
  menuItems: [],
};

export const getCategories = createAsyncThunk()

export const menuItemsSlice = createSlice({
  name: "menuItems",
  initialState,
  reducers: {
    loadCategoriesRequest: (state) => {
      state.isLoading = true;
    },
    loadCategoriesSuccess: (state, action) => {
      state.data = action.menuItems;
      state.isLoading = false;
      state.isFailed = false;
    },
    loadCategoriesFailure: (state) => {
      state.isLoading = false;
      state.isFailed = true;
    },
  },
});

const { actions, reducer } = menuItemsSlice;

export default reducer;

export const {
  loadCategoriesRequest,
  loadCategoriesSuccess,
  loadCategoriesFailure,
} = actions;
