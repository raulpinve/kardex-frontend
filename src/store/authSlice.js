import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: null,
    usuario: null,
    token: null, 
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
            const { token, ...usuario } = action.payload;
            state.usuario = {
                ...usuario,
                emailVerificado: true // No permite que aparezca mensaje de que usuario necesita verificar email cuando actualiza su información 
            };
            state.token = token;
        },
        actualizarAvatar: (state, action) => {
            state.usuario.avatarThumbnail = action.payload.avatarThumbnail;
            state.usuario.avatar = action.payload.avatar;
        }
    }
})

export const { login, logout, updateUser, actualizarAvatar } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;