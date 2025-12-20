import {api}from "../../../utils/authUtils";

const obtenerCorte = (token, corteId, productoId) => {
    const request = api.get(`/cortes/${corteId}/${productoId}/lote`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerLoteCorte = (token, corteId, loteId) => {
    return api.get(`/cortes/${corteId}/${loteId}/lote`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

export {
    obtenerCorte,
    obtenerLoteCorte
}