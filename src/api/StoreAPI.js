import axiosClient from './axiosClient';

const StoreAPI = {
  getMyStore: () => {
    const url = '/stores/my-store';
    return axiosClient.get(url);
  },
};

export default StoreAPI;
