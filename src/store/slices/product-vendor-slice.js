import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ currentPage, pageSize, searchText, orderBy }) => {
    const response = await axiosClient.get(
      `/products/pagination?skip=${
        currentPage * pageSize
      }&limit=${pageSize}&orderBy=${orderBy}&name%7B%7Bsearch%7D%7D=${searchText}`
    );
    return response;
  }
);

export const addProduct = createAsyncThunk('products/addProduct', async (product) => {
  const payloadProduct = {
    name: product.name,
    price: product.price,
    description: product.description,
    quantity: product.quantity,
    video: product.video,
    categoryId: product.category.value,
  };

  if (product.promotionalPrice) {
    payloadProduct.promotionalPrice = product.promotionalPrice;
    payloadProduct.dateValidPromote = product.dateValidPromote;
  }

  const listImage = [];
  for (let i = 0; i < product.images.length; i++) {
    const formData = new FormData();
    formData.append('file', product.images[i], { contentType: 'image/jpeg' });
    const response = await axiosClient.post('/files/cloud/upload', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Accept': '*/*',
      },
    });
    listImage.push(response.data.data);
  }
  if (listImage.length > 0) payloadProduct.images = listImage;

  if (product.attributes.length > 0) payloadProduct.attributes = product.attributes;

  const response = await axiosClient.post('/products', payloadProduct, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
});
export const editProduct = createAsyncThunk('products/editProduct', async (product) => {
  const listImage = [];

  for (let i = 0; i < product.listAddImage.length; i++) {
    const formData = new FormData();
    formData.append('file', product.listAddImage[i], { contentType: 'image/jpeg' });
    const response = await axiosClient.post('/files/cloud/upload', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Accept': '*/*',
      },
    });
    listImage.push(response.data.data);
  }
  if (listImage.length > 0) {
    product.listAddImage = listImage;
  }

  const response = await axiosClient.patch(`/products/${product.id}`, product, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
});
export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id) => {
  const response = await axiosClient.get(`/products/${id}`);
  return response;
});
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  await axiosClient.delete(`/products/${id}`);
  return id;
});
export const updateProduct = createAsyncThunk('products/updateProduct', async (product) => {
  const response = await axiosClient.patch(`/products/${product.Id}`, product, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});
export const activeProduct = createAsyncThunk('products/activeProduct', async ({ id, status }) => {
  const response = await axiosClient.patch(`/products/${id}/update-active?status=${status}`);
  return response;
});
export const updateQuantity = createAsyncThunk('products/update-quantity', async ({ id, quantity }) => {
  const response = await axiosClient.patch(
    `/products/${id}/update-quantity`,
    { quantity },
    {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
});

export const updateStatus = createAsyncThunk('products/update-status', async ({ id, status }) => {
  const response = await axiosClient.patch(`/products/${id}/update-status?status=${status}`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const productVendorSlice = createSlice({
  name: 'productVendors',
  initialState: {
    product: null,
    data: [],
    pagination: 0,
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(activeProduct.fulfilled, (state, action) => {
        const index = state.data.findIndex((product) => product.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.product = action.payload.data;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.product = action.payload.data;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.data = action.payload.data;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.data = action.payload.data;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const index = state.data.findIndex((product) => product.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log(action.payload.data);

        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.data = state.data.filter((product) => product.Id !== action.payload.data);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.data.findIndex((product) => product.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      });
  },
});

export const selectProducts = (state) => state.productVendors;
export default productVendorSlice.reducer;
