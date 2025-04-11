import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice"; 
import authReducer from "./authSlice";
import almacenReducer from "./almacenSlice";

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        auth: authReducer,
        almacen: almacenReducer
    },
});

