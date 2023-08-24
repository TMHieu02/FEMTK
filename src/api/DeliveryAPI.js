import axiosClient from './axiosClient';


const DeliveryAPI = {
  getDeliverys : () =>{
    const url = '/deliveries';
    return axiosClient.get(url);
  }
}

export default DeliveryAPI;