import { apiClient } from "../../../utils/authUtils";

const obtenerCategorias = (token, paginaActual) => {
    const request = apiClient(token).get(`/categorias?pagina=${paginaActual}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
} 

const crearCategoria = (token, data) => {
    const request = apiClient(token).post(`/categorias`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarCategoria = (token, categoriaId, data) => {
    const request = apiClient(token).put(`/categorias/${categoriaId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarCategoria = (token, almacenId) => {
    const request = apiClient(token).delete(`/categorias/${almacenId}`);
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