import axiosClient from './axiosClient';

const ReviewAPI = {
  getReviewByProduct: (id) => {
    const url = `/reviews/get-by-product/${id}`;
    return axiosClient.get(url);
  },
  checkBuy: (id) => {
    const url = `/reviews/check-buy?productId=${id}`;
    return axiosClient.get(url);
  },
  createReview: (payload) => {
    return axiosClient.post('/reviews', payload);
  },
};

export default ReviewAPI;
