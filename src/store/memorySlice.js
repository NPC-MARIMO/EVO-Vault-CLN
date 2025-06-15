import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createMemory = createAsyncThunk(
  'memory/create',
  async (memoryData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/memory/create-memory`,
        {
          url: memoryData.url,
          type: memoryData.type,
          family: memoryData.familyId,
          uploadedBy: memoryData.createdBy,
          description: memoryData.description
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Memory creation failed'
      );
    }
  }
);

const memorySlice = createSlice({
  name: "memory",
  initialState: {
    memories: [],
    loading: false,
    error: null,
    createdMemory: null
  },
  reducers: {
    resetMemoryError: (state) => {
      state.error = null;
    },
    resetCreatedMemory: (state) => {
      state.createdMemory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMemory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMemory.fulfilled, (state, action) => {
        state.loading = false;
        state.createdMemory = action.payload;
        state.memories.unshift(action.payload);
      })
      .addCase(createMemory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetMemoryError, resetCreatedMemory } = memorySlice.actions;
export default memorySlice.reducer;