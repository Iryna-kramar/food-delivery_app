import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getToppings = createAsyncThunk(
  "toppings/getToppings",
  async () => {
    const response = await axios.get("/toppings.json");
    return response.data;
  }
);

const initialState = {
  data: [],
  status: "idle", //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const toppingsSlice = createSlice({
  name: "toppings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getToppings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getToppings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.toppings = action.payload;
      })
      .addCase(getToppings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default toppingsSlice.reducer;
