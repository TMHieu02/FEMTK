const { createSlice } = require('@reduxjs/toolkit');

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    pagination: {
      total: 0,
    },
  },
  reducers: {
    setProducts(state, action) {
      console.log('action.payload', action);
      state.products = action.payload;
    },
    setPaginationProduct(state, action) {
      console.log('action.payload', action);

      state.pagination = action.payload;
    },
  },
});

export const { setProducts, setPaginationProduct } = productSlice.actions;
export default productSlice.reducer;
