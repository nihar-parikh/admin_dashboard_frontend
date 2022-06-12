import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    currentProduct: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    getProductStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      //no action required...u can remove action
    },
    getProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products = action.payload;
    },
    getProductFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },
    currentProductStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      //no action required...u can remove action
    },
    currentProductSuccess: (state, action) => {
      state.isFetching = false;
      state.currentProduct = action.payload;
    },
    currentProductFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },

    deleteProductStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      //no action required...u can remove action
    },
    deleteProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products.splice(
        // (item) => item._id === action.payload._id, //if delete method was to be used then (res.data=payload)/._id
        state.products.findIndex((item) => item._id === action.payload), //bcoz payload is id
        //finding index where the condition matches
        1
      );
    },
    deleteProductFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },

    updateProductStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      //no action required...u can remove action
    },
    updateProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products[
        state.products.findIndex((item) => item._id === action.payload.id)
      ] = action.payload.product;
      state.currentProduct = action.payload.product;
    },
    updateProductFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },

    addProductStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      //no action required...u can remove action
    },
    addProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products.push(action.payload);
    },
    addProductFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },
  },
});

export const {
  getProductStart,
  getProductSuccess,
  getProductFailure,
  currentProductStart,
  currentProductSuccess,
  currentProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  addProductStart,
  addProductSuccess,
  addProductFailure,
} = productSlice.actions;

const productReducer = productSlice.reducer; //it should be export default
export default productReducer;
