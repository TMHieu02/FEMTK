import axiosClient from './axiosClient';


const OrderAPI = {
  addOrder : (params) =>{
    const url = '/orders/add-my-order';
    return axiosClient.post(url, params);
  },
  getOrder : () =>{
    const url = '/orders';
    return axiosClient.get(url);
  }
}

export default OrderAPI;