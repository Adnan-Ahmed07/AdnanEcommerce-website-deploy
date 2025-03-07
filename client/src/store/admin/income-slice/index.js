import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  incomeData: [],
  loading: false,
  error: null
};

export const fetchIncomeData = createAsyncThunk(
  "income/fetchData",
  async () => {
    const response = await axios.get("http://localhost:5000/api/income/data");
    return response.data.data;
  }
);

const incomeSlice = createSlice({
  name: "income",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncomeData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.incomeData = action.payload;
      })
      .addCase(fetchIncomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default incomeSlice.reducer;