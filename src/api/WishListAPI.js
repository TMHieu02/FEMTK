import axiosClient from './axiosClient';


const WishListAPI = {
  add : (id) => {
    const url = `/me/like/${id}`;
    return axiosClient.post(url);
  },

  delete : (id) => {
    const url = `/me/like/${id}`;
    return axiosClient.delete(url);
  },
  
  getWishList : (param) => {
    const url = `/me/watchlist`;
    return axiosClient.get(url,param);
  },
}

export default WishListAPI;