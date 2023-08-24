import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async ({ currentPage, pageSize, searchText, orderBy }) => {
    const response = await axiosClient.get(
      `/stores/pagination?skip=${
        currentPage * pageSize
      }&limit=${pageSize}&orderBy=${orderBy}&name%7B%7Bsearch%7D%7D=${searchText}`
    );
    return response;
  }
);
export const register = createAsyncThunk('stores/register', async (input) => {
  const payload = { name: input.name, address: input.address, bio: input.bio };
  const indexImage = ['avatar', 'cover', 'featuredImages'];
  const listUpload = [];
  for (let i = 0; i < 3; i++) {
    const formData = new FormData();
    formData.append('file', input[indexImage[i]], { contentType: 'image/jpeg' });
    listUpload.push(
      axiosClient.post('/files/cloud/upload', formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Accept': '*/*',
        },
      })
    );
  }
  const [a, b, c] = await Promise.all(listUpload);
  payload.avatar = a.data.data;
  payload.cover = b.data.data;
  payload.featuredImages = c.data.data;
  const res = await axiosClient.post(`/stores/register`, payload, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return res;
});

export const deleteStore = createAsyncThunk('stores/deleteStore', async (id) => {
  await axiosClient.delete(`/stores/${id}`);
  return id;
});

export const getTotalStatisticStore = createAsyncThunk('stores/getTotalStatisticStore', async (id) => {
  const response = await axiosClient.get(`/statistics/get-total-statistic-store`);
  return response;
});

export const getMyProductStore = createAsyncThunk('stores/getTotalProductInStore', async () => {
  const response = await axiosClient.get(`/stores/total-product-store`);
  return response;
});

export const getOrderByStore = createAsyncThunk('stores/getOrderByStore', async (id) => {
  const response = await axiosClient.get(`/stores/getOrderByStore`);
  return response;
});

export const getProductsByStore = createAsyncThunk(
  'stores/getProductsByStore',
  async ({ currentPage, pageSize, searchText, orderBy, otherCondition }) => {
    const response = await axiosClient.get(
      `/stores/getProductsByMyStore?skip=${currentPage * pageSize}&limit=${pageSize}&orderBy=${orderBy}${
        otherCondition ? otherCondition : ''
      }&name%7B%7Bsearch%7D%7D=${searchText}`
    );

    return response;
  }
);

export const getOrdersByMyStore = createAsyncThunk(
  'stores/getOrdersByMyStore',
  async ({ currentPage, pageSize, searchText, orderBy, otherCondition }) => {
    const response = await axiosClient.get(
      `/stores/getOrdersByMyStore?skip=${currentPage * pageSize}&limit=${pageSize}&orderBy=${orderBy}${
        otherCondition ? otherCondition : ''
      }&code%7B%7Bsearch%7D%7D=${searchText}`
    );
    return response;
  }
);

export const updateStore = createAsyncThunk('stores/updateStore', async (store) => {
  const response = await axiosClient.patch(`/stores/${store.Id}`, store, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const updateActiveStore = createAsyncThunk('stores/updateActiveStore', async ({ Id, isActive }) => {
  const response = await axiosClient.patch(`/stores/${Id}/set-active-store?status=${isActive}`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});
export const updateDeleteStore = createAsyncThunk('stores/updateDeleteStore', async ({ Id, isDeleted }) => {
  const response = await axiosClient.patch(`/stores/${Id}/set-delete-store?status=${isDeleted}`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});
export const storesSlice = createSlice({
  name: 'stores',
  initialState: {
    total: {},
    totalProduct: 0,
    data: [],
    pagination: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, () => {})
      .addCase(updateActiveStore.fulfilled, (state, action) => {
        const index = state.data.findIndex((store) => store.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      })
      .addCase(updateDeleteStore.fulfilled, (state, action) => {
        const index = state.data.findIndex((store) => store.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      })
      .addCase(getProductsByStore.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(getOrdersByMyStore.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })

      .addCase(getTotalStatisticStore.fulfilled, (state, action) => {
        state.total = action.payload.data;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(deleteStore.fulfilled, (state, action) => {
        state.data = state.data.filter((store) => store.Id !== action.payload.data);
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        const index = state.data.findIndex((store) => store.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      })
      .addCase(getMyProductStore.fulfilled, (state, action) => {
        state.totalProduct = action.payload.data;
      });
  },
});

export const selectStores = (state) => state.stores;

export default storesSlice.reducer;
