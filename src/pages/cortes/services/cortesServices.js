import {api}from "../../../utils/authUtils";

export const crearCorte = ( data) => {
    const request = api.post(`/cortes`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const obtenerCorte = (corteId) => {
    const request = api.get(`/cortes/${corteId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const obtenerCortes = (almacenId, pagina = 1, consulta) => {
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


export const cerrarCorte = (corteId, data) => {
    const request = api.put(`/cortes/${corteId}/cerrar`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const eliminarCorte = (corteId) => {
    const request = api.delete(`/cortes/${corteId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const obtenerEvolucionLoteCorte = (corteId, loteId) => {
    const request = api.get(`/cortes/${corteId}/lotes/${loteId}/evolucion`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const obtenerEvolucionProductoCorte = (corteId, loteId) => {
    const request = api.get(`/cortes/${corteId}/productos/${loteId}/evolucion`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}