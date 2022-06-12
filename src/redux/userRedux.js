import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    otherCurrentUser: null,
    isFetching: false,
    error: false,
    users: [],
  },
  reducers: {
    loginStart: (state, action) => {
      state.isFetching = true;
      //no action required...u can remove action
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
      state.error = false;
    },
    loginFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },
    otherCurrentUserStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      //no action required...u can remove action
    },
    otherCurrentUserSuccess: (state, action) => {
      state.isFetching = false;
      state.otherCurrentUser = action.payload;
    },
    otherCurrentUserFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },

    getUsersStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      //no action required...u can remove action
    },
    getUsersSuccess: (state, action) => {
      state.isFetching = false;
      state.users = action.payload;
    },
    getUsersFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },

    deleteUserStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      //no action required...u can remove action
    },
    deleteUserSuccess: (state, action) => {
      state.isFetching = false;
      state.users.splice(
        // (item) => item._id === action.payload._id, //if delete method was to be used then (res.data=payload)/._id
        state.users.findIndex((item) => item._id === action.payload), //bcoz payload is id
        //finding index where the condition matches
        1
      );
    },
    deleteUserFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },

    addUserStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      //no action required...u can remove action
    },
    addUserSuccess: (state, action) => {
      state.isFetching = false;
      state.users.push(action.payload);
    },
    addUserFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },

    updateUserStart: (state, action) => {
      state.isFetching = true;
      state.error = false;
      //no action required...u can remove action
    },
    updateUserSuccess: (state, action) => {
      state.isFetching = false;
      state.users[
        state.users.findIndex((item) => item._id === action.payload.id)
      ] = action.payload.user;
      state.otherCurrentUser = action.payload.user;
    },
    updateUserFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },
    logoutStart: (state, action) => {
      state.isFetching = true;
      //no action required...u can remove action
    },
    logoutSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = null;
      state.error = false;
    },
    logoutFailure: (state, action) => {
      state.isFetching = false;
      state.error = true;
      //no action required...u can remove action
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  otherCurrentUserStart,
  otherCurrentUserSuccess,
  otherCurrentUserFailure,
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  addUserStart,
  addUserSuccess,
  addUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
} = userSlice.actions;

const userReducer = userSlice.reducer; //it should be export default
export default userReducer;
