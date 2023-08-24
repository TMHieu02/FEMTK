import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ currentPage, pageSize, searchText, orderBy }) => {
    const response = await axiosClient.get(
      `/orders/pagination?skip=${
        currentPage * pageSize
      }&limit=${pageSize}&orderBy=${orderBy}&code%7B%7Bsearch%7D%7D=${searchText}`
    );

    return response;
  }
);

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id) => {
  await axiosClient.delete(`/orders/${id}`);
  return id;
});

export const acceptOrder = createAsyncThunk('orders/acceptOrder', async (id) => {
  const response = await axiosClient.patch(`/orders/${id}/update-confirm`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const deliveryOrder = createAsyncThunk('orders/deliveryOrder', async (id) => {
  const response = await axiosClient.patch(`/orders/${id}/update-delivery`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});
export const cancelDeliver = createAsyncThunk('orders/cancelDeliver', async (id) => {
  const response = await axiosClient.patch(`/orders/${id}/cancel-delivery`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});
export const cancelOrder = createAsyncThunk('orders/cancelOrder', async (id) => {
  const response = await axiosClient.patch(`/orders/${id}/update-cancel`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const getOrder = createAsyncThunk('orders/getOrder', async (id) => {
  const response = await axiosClient.get(`/orders/${id}`);
  return response;
});

export const doneOrder = createAsyncThunk('orders/doneOrder', async (id) => {
  const response = await axiosClient.patch(`/orders/${id}/update-success`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async (order) => {
  const response = await axiosClient.patch(`/orders/${order.Id}`, order, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    order: null,
    data: [],
    pagination: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(cancelDeliver.fulfilled, (state, action) => {
        if (state.data.length > 0) {
          const index = state.data.findIndex((order) => order.Id === action.payload.data.Id);
          state.data[index] = action.payload.data;
        }
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.order = action.payload.data;
      })
      .addCase(deliveryOrder.fulfilled, (state, action) => {
        if (state.data.length > 0) {
          const index = state.data.findIndex((order) => order.Id === action.payload.data.Id);
          state.data[index] = action.payload.data;
        }
      })
      .addCase(acceptOrder.fulfilled, (state, action) => {
        if (state.data.length > 0) {
          const index = state.data.findIndex((order) => order.Id === action.payload.data.Id);
          state.data[index] = action.payload.data;
        }
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        if (state.data.length > 0) {
          const index = state.data.findIndex((order) => order.Id === action.payload.data.Id);
          state.data[index] = action.payload.data;
        }
      })
      .addCase(doneOrder.fulfilled, (state, action) => {
        if (state.data.length > 0) {
          const index = state.data.findIndex((order) => order.Id === action.payload.data.Id);
          state.data[index] = action.payload.data;
        }
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.data = state.data.filter((order) => order.Id !== action.payload.data);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.data.findIndex((order) => order.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      });
  },
});

export const selectOrders = (state) => state.orders;

export default ordersSlice.reducer;
