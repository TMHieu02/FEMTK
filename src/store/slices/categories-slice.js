import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({ currentPage, pageSize, searchText, orderBy }) => {
    const response = await axiosClient.get(
      `/categories/pagination?skip=${
        currentPage * pageSize
      }&limit=${pageSize}&orderBy=${orderBy}&name%7B%7Bsearch%7D%7D=${searchText}`
    );

    return response;
  }
);

export const fetchAllCategories = createAsyncThunk('categories/fetchAllCategories', async () => {
  const response = await axiosClient.get('/categories');
  return response;
});

export const addCategory = createAsyncThunk('categories/addCategory', async (category) => {
  const payloadCate = {
    name: category.name,
  };
  if (category.parentCategoryId) payloadCate.parentCategoryId = category.parentCategoryId;
  if (category.image !== null) {
    const formData = new FormData();
    formData.append('file', category.image, { contentType: 'image/jpeg' });
    const response = await axiosClient.post('/files/cloud/upload', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Accept': '*/*',
      },
    });
    payloadCate.image = response.data.data;
  }
  const response = await axiosClient.post('/categories', payloadCate, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id) => {
  await axiosClient.delete(`/categories/${id}`);
  return id;
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async (category) => {
  const payloadCate = {
    name: category.name,
  };
  if (category.parentCategoryId) payloadCate.parentCategoryId = category.parentCategoryId;
  payloadCate.isDeleted = category.isDeleted ? true : false;
  if (category.image) {
    const formData = new FormData();
    formData.append('file', category.image, { contentType: 'image/jpeg' });
    const response = await axiosClient.post('/files/cloud/upload', formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        'Accept': '*/*',
      },
    });
    payloadCate.image = response.data;
  }

  const response = await axiosClient.patch(`/categories/${category.Id}`, category, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    data: [],
    list: [],
    pagination: {
      total: 0,
    },
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.data.push(action.payload.data);
        state.list.push(action.payload.data);
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.data = state.data.filter((category) => category.Id !== action.payload.data);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.data.findIndex((category) => category.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.list.push({ Id: -1, Name: 'null' });
      });
  },
});

export const selectCategories = (state) => state.categories;

export default categoriesSlice.reducer;
