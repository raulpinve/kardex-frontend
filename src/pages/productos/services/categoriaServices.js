import {api}from "../../../utils/authUtils";

const obtenerTodasCategorias = async (tipo) => {
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