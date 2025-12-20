import {api}from "../../../utils/authUtils";

const obtenerTodasCategorias = async (token, tipo) => {
    const respuesta = await api.get("/categorias/todas", {
        params: {
            ...(tipo && { tipo }),
        }
    });
    return respuesta.data;
};

export {
    obtenerTodasCategorias,
}