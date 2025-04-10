import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: null,
    usuario: null,
    token: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState, 
    reducers:{
        login: (state, action) => {
            const { token, ...usuario } = action.payload;
            state.isAuthenticated = true
            state.usuario = usuario
            state.token= token
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.usuario = null;
            state.token = null
            localStorage.removeItem("token")
        },
        updateUser: (state, action) => {
            const updatedFields = action.payload;
            state.usuario = {
              ...state.usuario,
              ...updatedFields,
            };
        },
    }
})

export const { login, logout, updateUser } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;