import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const requestResetPasswordByEmaildateAuth = createAsyncThunk(
  'auth/requestResetPasswordByEmail',
  async (email) => {
    const response = await axiosClient.post(`/auth/forget-password?email=${email}`, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response;
  }
);

export const requestResetPasswordByEmail = createAsyncThunk(
  'auth/requestResetPasswordByEmail',
  async (email) => {
    const response = await axiosClient.post(`/auth/forget-password?email=${email}`, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response;
  }
);

export const resetPasswordByToken = createAsyncThunk(
  'auth/resetPasswordByToken',
  async ({ token, newPassword }) => {
    const response = await axiosClient.post(
      `/auth/reset-password`,
      {
        token,
        newPassword,
      },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  }
);

export const requestPin = createAsyncThunk('auth/requestPin', async (phone) => {
  const response = await axiosClient.post(`/auth/request-pin/${phone}`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response;
});
export const validatePin = createAsyncThunk('auth/validatePin', async ({ phone, token }) => {
  const response = await axiosClient.post(
    `/auth/validate-pin/${phone}`,
    { token },
    {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
});
export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: [],
    pagination: 0,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestResetPasswordByEmail.fulfilled, () => {})
      .addCase(requestPin.fulfilled, () => {})
      .addCase(validatePin.fulfilled, () => {})
      .addCase(resetPasswordByToken.fulfilled, () => {});
  },
});

export const selectAuths = (state) => state.auth;

export default authSlice.reducer;
