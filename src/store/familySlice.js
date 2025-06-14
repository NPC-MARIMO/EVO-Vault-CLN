import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // ✅ make sure axios is imported

export const createFamily = createAsyncThunk(
    "family/create",
    async (formData, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/family/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data; // contains message + family
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create family"
            );
        }
    }
);


export const getFamily = createAsyncThunk(
    "family/get",
    async (email, thunkAPI) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/family/get/${email}`);
            console.log("Families fetched from backend:", res.data); // 🔥
            return res.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch families"
            );
        }
    }
);

export const getParticularFamily = createAsyncThunk(
    "family/getParticularFamily",
    async (familyId, thunkAPI) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/family/get-family/${familyId}`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch families"
            );
        }
    }
);

const familySlice = createSlice({
    name: "family",
    initialState: {
        families: [],
        selectedFamily: null,
        creating: false,
        loading: false,
        error: null,
    },
    reducers: {
        clearFamilyError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createFamily.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createFamily.fulfilled, (state) => {
                state.creating = false;
            })
            .addCase(createFamily.rejected, (state, action) => {
                state.creating = false;
                state.error = action.payload;
            })

            .addCase(getFamily.pending, (state) => {
                state.loading = true;
            })
            .addCase(getFamily.fulfilled, (state, action) => {
                state.loading = false;
                state.families = action.payload;
            })
            .addCase(getFamily.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            .addCase(getParticularFamily.pending, (state) => {
                state.loading = true;
            })
            .addCase(getParticularFamily.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFamily = action.payload; // ✅ CORRECTED
            })
            .addCase(getParticularFamily.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearFamilyError } = familySlice.actions;
export default familySlice.reducer;
