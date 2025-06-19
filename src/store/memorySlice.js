import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helper for API calls
const memoryAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/memory`,
});

export const createMemory = createAsyncThunk(
  'memory/create',
  async (memoryData, { rejectWithValue }) => {
    try {
      const { data } = await memoryAPI.post('/create-memory', {
        url: memoryData.url,
        type: memoryData.type,
        family: memoryData.familyId,
        uploadedBy: memoryData.createdBy,
        description: memoryData.description
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Memory creation failed'
      );
    }
  }
);

export const fetchFamilyMemories = createAsyncThunk(
  'memory/fetchFamilyMemories',
  async (familyId, { rejectWithValue }) => {
    try {
      const res = await memoryAPI.get(`/get-memories/${familyId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch memories'
      );
    }
  }
);

export const deleteMemory = createAsyncThunk(
  'memory/delete',
  async ({ memoryId, userId }, { rejectWithValue }) => {
    try {
      const res = await memoryAPI.delete(`/delete-memory/${memoryId}/${userId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete memory'
      );
    }

  }
)

export const updateMemoryDescription = createAsyncThunk(
  'memory/updateDescription',
  async ({ memoryId, description }, { rejectWithValue }) => {
    try {
      const res = await memoryAPI.put(`/update-memory/${memoryId}`, { description });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update description'
      );
    }
  }
)

const initialState = {
  familyMemories: [], // Memories for current family
  createdMemory: null, // Last created memory
  loading: false,
  error: null,
  currentFamilyId: null, // Track which family's memories are loaded,
  deleteStatus: 'idle',
  updateStatus: 'idle'
};

const memorySlice = createSlice({
  name: "memory",
  initialState,
  reducers: {
    resetMemoryError: (state) => {
      state.error = null;
    },
    resetCreatedMemory: (state) => {
      state.createdMemory = null;
    },
    clearFamilyMemories: (state) => {
      state.familyMemories = [];
      state.currentFamilyId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Memory Cases
      .addCase(createMemory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMemory.fulfilled, (state, action) => {
        state.loading = false;
        state.createdMemory = action.payload;
        if (state.currentFamilyId === action.payload.family) {
          state.familyMemories.unshift(action.payload);
        }
      })
      .addCase(createMemory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Family Memories Cases
      .addCase(fetchFamilyMemories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilyMemories.fulfilled, (state, action) => {
        state.loading = false;
        state.familyMemories = action.payload.data;
        state.currentFamilyId = action.meta.arg; // Store the familyId we fetched for
      })
      .addCase(fetchFamilyMemories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentFamilyId = null;
      }).addCase(deleteMemory.pending, (state) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteMemory.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        const deletedId = action.payload.deletedMemory._id;

        console.log(action.payload);
        
        // Filter out deleted memory from list
        // state.memories = state.memories.filter(mem => mem._id !== deletedId);
      })
      .addCase(deleteMemory.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.payload || 'Failed to delete memory';
      }).addCase(updateMemoryDescription.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateMemoryDescription.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';

        const updated = action.payload.updatedMemory; 
      })
      .addCase(updateMemoryDescription.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload || 'Failed to update memory description';
      });
  }
});

export const {
  resetMemoryError,
  resetCreatedMemory,
  clearFamilyMemories
} = memorySlice.actions;

export default memorySlice.reducer;