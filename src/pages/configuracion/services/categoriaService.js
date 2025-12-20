import {api}from "../../../utils/authUtils";

const obtenerCategorias = async (pagina=1, tipo, consulta) => {
    const respuesta = await api.get("/categorias", {
        params: {
            pagina,
            ...(tipo && { tipo }),
            ...(consulta && { consulta })
        }
    });
    return respuesta.data;
};

const crearCategoria = (data) => {
    const request = api.post(`/categorias`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarCategoria = (categoriaId, data) => {
    const request = api.put(`/categorias/${categoriaId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarCategoria = (almacenId) => {
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