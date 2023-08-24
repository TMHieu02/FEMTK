import axiosClient from './axiosClient';


const productAPI = {
  getNewProduct : (params) => {
    const url = '/post';
    return axiosClient.get(url, {params});
  },
  
  searchProduct : (params) => {
    const url = '/post/search';
    return axiosClient.get(url, {params});
  },

  getAll : () =>{
    const url = '/products';
    return axiosClient.get(url);
  },

  getProduct: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },

  getPost: (id) => {
    const url = `/post/${id}`;
    return axiosClient.get(url);
  },

  getProductsByCategory: (params) => {
    const url = `/post/category`;
    return axiosClient.get(url, {params});
  },
  uploadImage: (formData) => {
    const url = '/image/cloud/upload';
    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },

  createPost: (params) => {
    const url = '/post';
    return axiosClient.post(url, params);
  },
  getMyPost: (params) =>{
    const url = '/me/posts';
    return axiosClient.get(url, {params});
  },
  getPostAdmin: (params) =>{
    const url = '/post/admin';
    return axiosClient.get(url, {params});
  },
  updatePost: (params) => {
    const url = `/post/${params.id}`;
    return axiosClient.patch(url,params);
  },
  deletePost: (id) => {
    const url = `/post/${id}`;
    return axiosClient.delete(url);
  },
  approvePost: (id) => {
    const url = `/post/published/${id}`;
    return axiosClient.patch(url);
  },

}

export default productAPI;