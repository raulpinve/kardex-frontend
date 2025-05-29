import { apiClient } from "../../../utils/authUtils";

const obtenerTodasCategorias = async (token, tipo) => {
    const respuesta = await apiClient(token).get("/categorias/todas", {
        params: {
            ...(tipo && { tipo }),
        }
    });
    return respuesta.data;
};

export {
    obtenerTodasCategorias,
}