import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sidebarOpen: typeof window !== "undefined" 
        ? JSON.parse(localStorage.getItem("sidebarOpen")) ?? window.innerWidth >= 1024
        : true,
};

const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
            localStorage.setItem("sidebarOpen", JSON.stringify(state.sidebarOpen));
        },
        setSidebar: (state, action) => {
            state.sidebarOpen = action.payload;
            localStorage.setItem("sidebarOpen", JSON.stringify(action.payload));
        }
    }
});

export const { toggleSidebar, setSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
