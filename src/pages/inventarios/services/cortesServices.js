import {api}from "../../../utils/authUtils";

const obtenerCortes = (token, almacenId, pagina = 1, consulta) => {
    const request = api.get(`/cortes/${almacenId}/almacen`, {
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

const crearCorte = (token, data) => {
    const request = api.post(`/cortes`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerCortePeriodo = (token, periodo, almacenId) => {
    const request = api.get(`/cortes/${periodo}/${almacenId}/periodo`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerCorte = (token, corteId) => {
    const request = api.get(`/cortes/${corteId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const cerrarCorte = (token, corteId) => {
    const request = api.put(`/cortes/${corteId}/cerrar`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerCorteLote = (token, corteId, loteId) => {
    return api.get(`/cortes/${corteId}/${loteId}/lote`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

const obtenerCorteLotes = (token, corteId, productoId, pagina, consulta) => {
    return api.get(`/cortes/${corteId}/${productoId}/lotes`, {
        params: {
            pagina,
            ...(consulta && { consulta })
        }
    })
    .then(response => response.data)
    .catch(err => {
        throw err;
    });
}

const eliminarCorte = (token, corteId) => {
    const request = api.delete(`/cortes/${corteId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerCortes,
    crearCorte,
    cerrarCorte,
    obtenerCorte,
    obtenerCorteLote,
    obtenerCorteLotes,
    obtenerCortePeriodo,
    eliminarCorte
}