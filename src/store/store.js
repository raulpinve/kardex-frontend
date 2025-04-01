import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import sidebarReducer from "./sidebarSlice"; 
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        auth: authReducer,
        user: userReducer,
    },
});

