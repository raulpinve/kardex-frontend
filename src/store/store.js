import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./sidebarSlice"; // Importamos el reducer del sidebar

export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer, // Agregamos el estado del sidebar al store
    },
});

