import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
export const fetchStoreLevels = createAsyncThunk(
  'storelevels/fetchStoreLevels',
  async ({ currentPage, pageSize, searchText, orderBy }) => {
    const response = await axiosClient.get(
      `/storelevels/pagination?skip=${
        currentPage * pageSize
      }&limit=${pageSize}&orderBy=${orderBy}&name%7B%7Bsearch%7D%7D=${searchText}`
    );
    return response;
  }
);

export const addStoreLevel = createAsyncThunk('storelevels/addStoreLevel', async (storeLevel) => {
  const response = await axiosClient.post('/storelevels', storeLevel, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const deleteStoreLevel = createAsyncThunk('storelevels/deleteStoreLevel', async (id) => {
  await axiosClient.delete(`/storeLevels/${id}`);
  return id;
});

export const updateStoreLevel = createAsyncThunk('storelevels/updateStoreLevel', async (storeLevel) => {
  const response = await axiosClient.patch(`/storelevels/${storeLevel.Id}`, storeLevel, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const storeLevelsSlice = createSlice({
  name: 'storeLevels',
  initialState: {
    data: [],
    pagination: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreLevels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoreLevels.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchStoreLevels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addStoreLevel.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
      })
      .addCase(deleteStoreLevel.fulfilled, (state, action) => {
        state.data = state.data.filter((storeLevel) => storeLevel.Id !== action.payload.data);
      })
      .addCase(updateStoreLevel.fulfilled, (state, action) => {
        const index = state.data.findIndex((storeLevel) => storeLevel.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      });
  },
});

export const selectStoreLevels = (state) => state.storeLevels;

export default storeLevelsSlice.reducer;
