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
    return res.data.requests; // ✅ return just the array
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch requests"
    );
  }
});

export const updateRequest = createAsyncThunk(
  "request/update",
  async ({ reqId, action, email }, thunkAPI) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/request/update/${email}`,
        { reqId, action } // send as flat JSON
      );
      return res.data.request; // assuming you want the updated request back
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update request"
      );
    }
  }
);


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
      // Send request
      .addCase(sendRequest.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendRequest.fulfilled, (state) => {
        state.sending = false;
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })

      // Get requests
      .addCase(getRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = [...action.payload];
      })
      .addCase(getRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update request (accept/reject)
      .addCase(updateRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRequest.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        // Replace the updated request in the array
        state.requests = state.requests.map((req) =>
          req._id === updated._id ? updated : req
        );
      })
      .addCase(updateRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default requestSlice.reducer;
