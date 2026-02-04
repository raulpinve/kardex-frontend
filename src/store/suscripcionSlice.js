import { createSlice } from "@reduxjs/toolkit";

const initialSuscripcion = {
    id: null,
    plan: null,
    estado: null,
    fecha_inicio: null,
    fecha_fin: null,
    pendienteDesbloqueo: false,
};

const suscripcionSlice = createSlice({
    name: "suscripcion",
    initialState: {
        suscripcion: initialSuscripcion,
        modoLectura: false,
    },
    reducers: {
        setSuscripcion: (state, action) => {
            state.suscripcion = action.payload.suscripcion || initialSuscripcion;
            state.modoLectura = !!action.payload.modoLectura;
        },
        clearSuscripcion: (state) => {
            state.suscripcion = initialSuscripcion;
            state.modoLectura = false;
        },
        setPendienteDesbloqueo: (state, action) => {
            // Aquí actualizas solo el campo pendienteDesbloqueo
            if (state.suscripcion) {
                state.suscripcion.pendienteDesbloqueo = action.payload;
            }
        }
    },
});

export const { setSuscripcion, clearSuscripcion, setPendienteDesbloqueo } = suscripcionSlice.actions;
export default suscripcionSlice.reducer;
