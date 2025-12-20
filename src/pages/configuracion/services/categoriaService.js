import {api}from "../../../utils/authUtils";

const obtenerCategorias = async (token, pagina=1, tipo, consulta) => {
    const respuesta = await api.get("/categorias", {
        params: {
            pagina,
            ...(tipo && { tipo }),
            ...(consulta && { consulta })
        }
    });
    return respuesta.data;
};

const crearCategoria = (token, data) => {
    const request = api.post(`/categorias`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarCategoria = (token, categoriaId, data) => {
    const request = api.put(`/categorias/${categoriaId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarCategoria = (token, almacenId) => {
    const request = api.delete(`/categorias/${almacenId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}


export {
    obtenerCategorias,
    crearCategoria,
    editarCategoria, 
    eliminarCategoria
}