import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { data } from "react-router-dom";

// Register
export const registerUser = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

// Login
export const loginUser = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, data, {
      withCredentials: true,
    });
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user)); // store user safely
    return { user, token };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// Get User
export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return res.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch user");
  }
});

// Update Profile
export const updateProfile = createAsyncThunk("auth/updateProfile", async (data, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/profile/update-profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const updatedUser = res.data.user;
    localStorage.setItem("user", JSON.stringify(updatedUser)); // update local storage
    return updatedUser;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Update failed");
  }
});


export const getParticularUser = createAsyncThunk(
  "auth/getParticularUser",
  async (searchValue, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile/get-user`,
        {
          params: { search: searchValue }, // 👈 Correctly sent as query
        }
      );
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);


// Safely get stored user from localStorage
let storedUser = null;
try {
  const raw = localStorage.getItem("user");
  storedUser = raw && raw !== "undefined" ? JSON.parse(raw) : null;
} catch {
  storedUser = null;
}

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    searchedUser: null,
    searchedUserLoading: false,
    searchedUserError: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearSearchedUser: (state) => {
      state.searchedUser = null;
      state.searchedUserError = null;
      state.searchedUserLoading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getParticularUser.pending, (state) => {
        state.searchedUserLoading = true;
        state.searchedUser = null;
        state.searchedUserError = null;
      })
      .addCase(getParticularUser.fulfilled, (state, action) => {
        state.searchedUserLoading = false;
        state.searchedUser = action.payload;
      })
      .addCase(getParticularUser.rejected, (state, action) => {
        state.searchedUserLoading = false;
        state.searchedUser = null;
        state.searchedUserError = action.payload;
      });
  },
});

export const { logout, clearSearchedUser } = authSlice.actions;
export default authSlice.reducer;
