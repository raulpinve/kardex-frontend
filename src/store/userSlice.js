import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const userSlice = createSlice({
    name: 'user',
    initialState, 
    reducers:{
        setUser: (state, action) => {
            const {...user } = action.payload;
            state.user = user
        },
        updateUser: (state, action) => {
            const updatedFields = action.payload;
            state.user = {
              ...state.user,
              ...updatedFields,
            };
        },
        removeUser: (state, action) => {
            state.user =null
        }
    }
})

export const { setUser, updateUser, removeUser} = userSlice.actions;
export default userSlice.reducer;