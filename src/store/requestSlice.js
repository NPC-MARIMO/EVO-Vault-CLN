import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// 📤 Send a join request
export const sendRequest = createAsyncThunk("request/send", async (data, thunkAPI) => {
  console.log("✅ sendRequest thunk called", data);
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/request/send`, data);
    return res.data;
  } catch (error) {
    console.error("❌ Axios error", error);
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Request failed"
    );
  }
});

// 📥 Get all join requests for a user by email
export const getRequests = createAsyncThunk("request/get", async (email, thunkAPI) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/request/get-req/${email}`);
    // 🔥 return the actual array, not an object
    return res.data.requests; 
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch requests"
    );
  }
});

// 📦 Slice
const requestSlice = createSlice({
  name: "request",
  initialState: {
    requests: [],
    sending: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendRequest.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendRequest.fulfilled, (state) => {
        state.sending = false;
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })
      .addCase(getRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = [...action.payload]; // ✅ force new array to trigger UI updates
      })
      .addCase(getRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default requestSlice.reducer;
