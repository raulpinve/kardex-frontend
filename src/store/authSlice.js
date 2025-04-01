import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: null,
    user: null,
    token: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState, 
    reducers:{
        login: (state, action) => {
            const { token, ...user } = action.payload;
            state.isAuthenticated = true
            state.user = user
            state.token= token
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null
            localStorage.removeItem("token")
        },
        updateUser: (state, action) => {
            const updatedFields = action.payload;
            state.user = {
              ...state.user,
              ...updatedFields,
            };
        },
    }
})

export const { login, logout, updateUser } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;