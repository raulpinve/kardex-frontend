import {api} from "../../../utils/authUtils";

const crearAlmacen = (data) => {
    const request = api.post(`/almacenes`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerAlmacenes = (pagina = 1, consulta) => {
    const request = api.get(`/almacenes`, {
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

const editarAlmacen = (almacenId, data) => {
    const request = api.put(`/almacenes/${almacenId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarAlmacen = (almacenId) => {
    const request = api.delete(`/almacenes/${almacenId}`);
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