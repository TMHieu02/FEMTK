import axiosClient from './axiosClient';

const UserAPI = {
  getMyUserInfor: () => {
    const url = '/app-user';
    return axiosClient.get(url);
  },

  updateMyUserInfor: (params) => {
    const url = `/me?firstName=${params.firstName}&lastName=${params.lastName}&phone=${params.phoneNumber}&email=${params.email}`;
  return axiosClient.patch(url);
  },

  updateAvatar: (avatar) => {
    return axiosClient.patch(`/users/update-avatar`, { avatar });
  },

  register: (params) => {
    const url = '/auth/register';
    return axiosClient.post(url, params);
  },

  login: (params) => {
    const url = '/auth/authenticate';
    return axiosClient.post(url, { email: params.email, password: params.password });
  },

  changePassword: (params) => {
    const url = '/me/change-password';
    return axiosClient.post(url, params);
  }
};

export default UserAPI;
