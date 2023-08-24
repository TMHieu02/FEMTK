import axiosClient from './axiosClient';


const CartAPI = {
  addToCart : (params) =>{
    const url = '/carts/add';
    return axiosClient.post(url,params);
  },
  getCartItems : (params) =>{
    const url = `carts/my-carts?skip=${params.skip}&limit=${params.limit}&orderBy=createAt`;
    return axiosClient.get(url);
  },
  updateCartItem : (params) =>{
    const url = '/carts/update';
    return axiosClient.patch(url,params);
  },
  deleteProductInCart : (params) =>{
    const url = '/carts/remove/';
    return axiosClient.delete(url+ params);
  },
  deleteAllProductInCart : () =>{
    const url = '/carts/remove-all';
    return axiosClient.delete(url);
  }
}

export default CartAPI;