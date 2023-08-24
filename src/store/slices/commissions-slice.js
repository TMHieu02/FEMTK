import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
export const fetchCommissions = createAsyncThunk(
  'commissions/fetchCommissions',
  async ({ currentPage, pageSize, searchText, orderBy }) => {
    const response = await axiosClient.get(
      `/commissions/pagination?skip=${
        currentPage * pageSize
      }&limit=${pageSize}&orderBy=${orderBy}&name%7B%7Bsearch%7D%7D=${searchText}`
    );
    return response;
  }
);

export const addCommission = createAsyncThunk('commissions/addCommission', async (commission) => {
  const response = await axiosClient.post('/commissions', commission, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const deleteCommission = createAsyncThunk('commissions/deleteCommission', async (id) => {
  await axiosClient.delete(`/commissions/${id}`);
  return id;
});

export const updateCommission = createAsyncThunk('commissions/updateCommission', async (commission) => {
  const response = await axiosClient.patch(`/commissions/${commission.Id}`, commission, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const commissionsSlice = createSlice({
  name: 'commissions',
  initialState: {
    data: [],
    pagination: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchCommissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCommission.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
      })
      .addCase(deleteCommission.fulfilled, (state, action) => {
        state.data = state.data.filter((commission) => commission.Id !== action.payload.data);
      })
      .addCase(updateCommission.fulfilled, (state, action) => {
        const index = state.data.findIndex((commission) => commission.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      });
  },
});

export const selectCommissions = (state) => state.commissions;

export default commissionsSlice.reducer;
