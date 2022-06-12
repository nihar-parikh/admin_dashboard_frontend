import { publicRequest, userRequest } from "../requestMethods";
import {
  getProductFailure,
  getProductStart,
  getProductSuccess,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  addProductStart,
  addProductSuccess,
  addProductFailure,
  currentProductStart,
  currentProductSuccess,
  currentProductFailure,
} from "./productRedux";
import {
  addUserFailure,
  addUserStart,
  addUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  logoutFailure,
  logoutStart,
  logoutSuccess,
  otherCurrentUserFailure,
  otherCurrentUserStart,
  otherCurrentUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "./userRedux";

//Admin login
export const login = async (dispatch, userInfo) => {
  dispatch(loginStart());

  try {
    const res = await publicRequest.post("users/login", userInfo); //don't use {userInfo:userInfo} bcoz already userInfo is an object
    if (res.data.isAdmin) {
      localStorage.setItem("token", res.data.token);
      dispatch(loginSuccess(res.data));
    } else {
      dispatch(loginFailure());
    }
  } catch (error) {
    dispatch(loginFailure());
  }
};

//Get a user
export const getOtherCurrentUser = async (dispatch, userId) => {
  dispatch(otherCurrentUserStart());
  try {
    const res = await userRequest.get(`/users/${userId}`);
    if (res.data) {
      dispatch(otherCurrentUserSuccess(res.data));
    } else {
      dispatch(otherCurrentUserFailure());
    }
  } catch (error) {
    dispatch(otherCurrentUserFailure());
  }
};

//Get all users
export const getUsers = async (dispatch, querySearch) => {
  dispatch(getUsersStart());

  try {
    const res = await userRequest.get(`/users?name=${querySearch}`);
    if (res.data) {
      dispatch(getUsersSuccess(res.data));
    } else {
      dispatch(getUsersFailure());
    }
  } catch (error) {
    dispatch(getUsersFailure());
  }
};

//Delete user
export const deleteUser = async (id, dispatch) => {
  dispatch(deleteUserStart());

  try {
    //not public request bcoz admin can only delete
    const res = await userRequest.delete(`/users/deleteuser/${id}`);
    if (res.data) {
      dispatch(deleteUserSuccess(id));
    } else {
      dispatch(deleteUserFailure());
    }
  } catch (error) {
    console.log("error:", error);
    dispatch(deleteUserFailure());
  }
};

//Add user
export const addUser = async (user, dispatch) => {
  dispatch(addUserStart());

  try {
    const res = await userRequest.post("/users/signup", user);
    if (res.data) {
      dispatch(addUserSuccess(res.data));
    } else {
      dispatch(addUserFailure());
    }
  } catch (error) {
    dispatch(addUserFailure());
  }
};

//Update user
export const updateUser = async (id, user, dispatch) => {
  dispatch(updateUserStart());

  try {
    const res = await userRequest.put(`/users/${id}`, user);
    if (res.data) {
      dispatch(updateUserSuccess({ id, user }));
    } else {
      dispatch(updateUserFailure());
    }
  } catch (error) {
    dispatch(updateUserFailure());
  }
};

//Get a product
export const getCurrentProduct = async (dispatch, productId) => {
  dispatch(currentProductStart());
  try {
    const res = await publicRequest.get(`/products/${productId}`);
    if (res.data) {
      dispatch(currentProductSuccess(res.data));
    } else {
      dispatch(currentProductFailure());
    }
  } catch (error) {
    dispatch(currentProductFailure());
  }
};

//Get all products
export const getProducts = async (dispatch, querySearch) => {
  dispatch(getProductStart());

  try {
    const res = await publicRequest.get(`/products?title=${querySearch}`);
    if (res.data) {
      dispatch(getProductSuccess(res.data));
    } else {
      dispatch(getProductFailure());
    }
  } catch (error) {
    dispatch(getProductFailure());
  }
};

//Delete product
export const deleteProduct = async (id, dispatch) => {
  dispatch(deleteProductStart());

  try {
    //not public request bcoz admin can only delete
    const res = await userRequest.delete(`/products/deleteproduct/${id}`);
    if (res.data) {
      dispatch(deleteProductSuccess(id));
    } else {
      dispatch(deleteProductFailure());
    }
  } catch (error) {
    console.log("error:", error);
    dispatch(deleteProductFailure());
  }
};

//Update product
export const updateProducts = async (id, product, dispatch) => {
  dispatch(updateProductStart());

  try {
    const res = await userRequest.put(`/products/${id}`, product);
    if (res.data) {
      dispatch(updateProductSuccess({ id, product }));
    } else {
      dispatch(updateProductFailure());
    }
  } catch (error) {
    dispatch(updateProductFailure());
  }
};

//Add product
export const addProducts = async (product, dispatch) => {
  dispatch(addProductStart());

  try {
    const res = await userRequest.post("/products", product);
    if (res.data) {
      dispatch(addProductSuccess(res.data));
    } else {
      dispatch(addProductFailure());
    }
  } catch (error) {
    dispatch(addProductFailure());
  }
};

//logout
export const logout = async (dispatch) => {
  dispatch(logoutStart());

  try {
    const res = await userRequest.post("/users/logout");
    if (res.data) {
      localStorage.removeItem("token");
      dispatch(logoutSuccess());
    } else {
      dispatch(logoutFailure());
    }
  } catch (error) {
    dispatch(logoutFailure());
  }
};
