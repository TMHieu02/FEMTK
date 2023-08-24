import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
export const fetchUserLevels = createAsyncThunk(
  'userlevels/fetchUserLevels',
  async ({ currentPage, pageSize, searchText, orderBy }) => {
    const response = await axiosClient.get(
      `/userlevels/pagination?skip=${
        currentPage * pageSize
      }&limit=${pageSize}&orderBy=${orderBy}&name%7B%7Bsearch%7D%7D=${searchText}`
    );
    return response;
  }
);

export const addUserLevel = createAsyncThunk('userlevels/addUserLevel', async (userLevel) => {
  const response = await axiosClient.post('/userlevels', userLevel, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const deleteUserLevel = createAsyncThunk('userlevels/deleteUserLevel', async (id) => {
  await axiosClient.delete(`/userLevels/${id}`);
  return id;
});

export const updateUserLevel = createAsyncThunk('userlevels/updateUserLevel', async (userLevel) => {
  const response = await axiosClient.patch(`/userlevels/${userLevel.Id}`, userLevel, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const userLevelsSlice = createSlice({
  name: 'userLevels',
  initialState: {
    data: [],
    pagination: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLevels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchUserLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addUserLevel.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
      })
      .addCase(deleteUserLevel.fulfilled, (state, action) => {
        state.data = state.data.filter((userLevel) => userLevel.Id !== action.payload.data);
      })
      .addCase(updateUserLevel.fulfilled, (state, action) => {
        const index = state.data.findIndex((userLevel) => userLevel.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      });
  },
});

export const selectUserLevels = (state) => state.userLevels;

export default userLevelsSlice.reducer;
