import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
  error: null,
};

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/customer/review/add",
        formData
      );
      return response.data;
    } catch (err) {
      // Handle both server errors and network errors
      return rejectWithValue({
        success: false,
        message: err.response?.data?.message || "Failed to submit review",
        status: err.response?.status || 500
      });
    }
  }
);

export const getReviews = createAsyncThunk(
  "reviews/getReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/customer/review/${productId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue({
        success: false,
        message: err.response?.data?.message || "Failed to fetch reviews",
        status: err.response?.status || 500
      });
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviewErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          
          state.error = null;
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = {
          message: action.payload?.message || "Unknown error occurred",
          status: action.payload?.status
        };
      })

      // Handle getReviews lifecycle
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.reviews = action.payload.data;
        }
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.error = {
          message: action.payload?.message || "Failed to load reviews",
          status: action.payload?.status
        };
      });
  }
});

export const { clearReviewErrors } = reviewSlice.actions;
export default reviewSlice.reducer;