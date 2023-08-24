import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
export const fetchDeliveries = createAsyncThunk(
  'deliveries/fetchDeliveries',
  async ({ currentPage, pageSize, searchText, orderBy }) => {
    const response = await axiosClient.get(
      `/deliveries/pagination?skip=${
        currentPage * pageSize
      }&limit=${pageSize}&orderBy=${orderBy}&name%7B%7Bsearch%7D%7D=${searchText}`
    );
    return response;
  }
);

export const addDelivery = createAsyncThunk('deliveries/addDelivery', async (delivery) => {
  const response = await axiosClient.post('/deliveries', delivery, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const deleteDelivery = createAsyncThunk('deliveries/deleteDelivery', async (id) => {
  await axiosClient.delete(`/deliveries/${id}`);
  return id;
});

export const updateDelivery = createAsyncThunk('deliveries/updateDelivery', async (delivery) => {
  const response = await axiosClient.patch(`/deliveries/${delivery.Id}`, delivery, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState: {
    data: [],
    pagination: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addDelivery.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
      })
      .addCase(deleteDelivery.fulfilled, (state, action) => {
        state.data = state.data.filter((delivery) => delivery.Id !== action.payload.data);
      })
      .addCase(updateDelivery.fulfilled, (state, action) => {
        const index = state.data.findIndex((delivery) => delivery.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      });
  },
});

export const selectDeliveries = (state) => state.deliveries;

export default deliveriesSlice.reducer;
