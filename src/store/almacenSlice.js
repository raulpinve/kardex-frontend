import { createSlice } from "@reduxjs/toolkit";

const almacenSlice = createSlice({
    name: "almacen",
    initialState: {}, 
    reducers: {
        setAlmacen: (state, action) => {
            state.almacen = action.payload
        },
        deleteAlmacen: (state, action) => {
            state.almacen = null
        }
    }
})

export const {setAlmacen, deleteAlmacen} = almacenSlice.actions;
export default almacenSlice.reducer;