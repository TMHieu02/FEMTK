import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ currentPage, pageSize, searchText, orderBy }) => {
    const response = await axiosClient.get(
      `/users/pagination?skip=${
        currentPage * pageSize
      }&limit=${pageSize}&orderBy=${orderBy}&displayName%7B%7Bsearch%7D%7D=${searchText}`
    );

    return response;
  }
);
export const updateAvatar = createAsyncThunk('users/updateAvatar', async (avatar) => {
  const res = await axiosClient.post(`/users/update-avatar`, { avatar });
  return res;
});
export const deleteUser = createAsyncThunk('users/deleteUser', async (id) => {
  await axiosClient.delete(`/users/${id}`);
  return id;
});

export const updateUser = createAsyncThunk('users/updateUser', async (user) => {
  const response = await axiosClient.patch(`/users/${user.Id}`, user, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    pagination: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAvatar.fulfilled, () => {})
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data.data;
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter((user) => user.Id !== action.payload.data);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.data.findIndex((user) => user.Id === action.payload.data.Id);
        state.data[index] = action.payload.data;
      });
  },
});

export const selectUsers = (state) => state.users;

export default usersSlice.reducer;
