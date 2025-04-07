import { apiClient } from "../../../utils/authUtils";

const crearAlmacen = (token, data) => {
    const request = apiClient(token).post(`/almacenes`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerAlmacenes = (token, pagina = 1, consulta) => {
    const request = apiClient(token).get(`/almacenes`, {
        params: {
            pagina,
            ...(consulta && { consulta })
        }
    });
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
} 

const editarAlmacen = (token, almacenId, data) => {
    const request = apiClient(token).put(`/almacenes/${almacenId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarAlmacen = (token, almacenId) => {
    const request = apiClient(token).delete(`/almacenes/${almacenId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerAlmacenes, 
    crearAlmacen, 
    editarAlmacen,
    eliminarAlmacen
}