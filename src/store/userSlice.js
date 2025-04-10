import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'usuario',
    initialState: {}, 
    reducers:{
        setUser: (state, action) => {
            const {...usuario } = action.payload;
            state.usuario = usuario
        },
        updateUser: (state, action) => {
            const updatedFields = action.payload;
            state.usuario = {
              ...state.usuario,
              ...updatedFields,
            };
        },
        removeUser: (state, action) => {
            state.usuario =null
        }
    }
})

export const { setUser, updateUser, removeUser} = userSlice.actions;
export default userSlice.reducer;