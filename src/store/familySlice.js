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

export const deleteFamilyMember = createAsyncThunk(
    'family/deleteFamilyMember',
    async ({ familyId, memberId }, thunkAPI) => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/family/delete-member/${familyId}/${memberId}`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete family member"
            )
        }
    }
)



export const updateMemberRole = createAsyncThunk(
    'family/updateFamilyMember',
    async ({ familyId, memberId, role }, thunkAPI) => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/family/update-member/${familyId}/${memberId}`, { role });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update role of family member"
            )
        }
    }
)

export const updateFamily = createAsyncThunk(
    'family/updateFamily',
    async ({ familyId, formData }, thunkAPI) => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/family/update-family/${familyId}`, { formData });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update family"
            )
        }
    }
)


export const deleteFamily = createAsyncThunk(
    'family/deleteFamily',
    async ({ familyId }, thunkAPI) => {
        try {
            // Validate familyId before making the request
            if (!familyId) {
                throw new Error("Family ID is required");
            }

            const res = await axios.delete(
                `${import.meta.env.VITE_API_URL}/family/delete-family/${familyId}`,
            );

            return res.data;

        } catch (error) {
            // Handle network errors and validation errors
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to delete family"
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
        updateStatus: "idle",
        deleteStatus: "idle"
    },
    reducers: {
        clearFamilyError: (state) => {
            state.error = null;
        },
        resetDeleteStatus: (state) => {
            state.deleteStatus = 'idle';
        }
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
                state.selectedFamily = action.payload;
            })
            .addCase(getParticularFamily.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(deleteFamilyMember.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteFamilyMember.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteFamilyMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(updateMemberRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMemberRole.fulfilled, (state, action) => {
                state.loading = false;
                if (state.selectedFamily && state.selectedFamily._id === action.payload.familyId) {
                    const memberIndex = state.selectedFamily.members.findIndex(
                        member => member.user._id === action.payload.memberId
                    );
                    if (memberIndex !== -1) {
                        state.selectedFamily.members[memberIndex].role = action.payload.newRole;
                    }
                }
            })
            .addCase(updateMemberRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(updateFamily.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.updateStatus = 'loading';
            })
            .addCase(updateFamily.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFamily = action.payload.data;
                state.updateStatus = 'succeeded';

                // If you have a families array in state, you might want to update it too
                if (state.families) {
                    state.families = state.families.map(family =>
                        family._id === action.payload.data._id ? action.payload.data : family
                    );
                }
            })
            .addCase(updateFamily.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.updateStatus = 'failed';
            }).addCase(deleteFamily.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.deleteStatus = 'loading';
            })
            .addCase(deleteFamily.fulfilled, (state, action) => {
                state.loading = false;
                state.deleteStatus = 'succeeded';

                state.families = state.families.filter(
                    family => family._id !== action.payload.data._id
                );

                if (state.selectedFamily?._id === action.payload.data._id) {
                    state.selectedFamily = null;
                }

            })
            .addCase(deleteFamily.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.deleteStatus = 'failed';
            })
    },
});

export const { clearFamilyError } = familySlice.actions;
export default familySlice.reducer;
