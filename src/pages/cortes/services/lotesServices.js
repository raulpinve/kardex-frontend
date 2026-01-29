import { api } from "../../../utils/authUtils";

export const obtenerListadoCorteLotes = (corteId, productoId, pagina, consulta) => {
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


export const obtenerLote = (loteId) => {
    return api.get(`/lotes/${loteId}`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}


export const obtenerResumenLoteCorte = ( corteId, loteId) => {
    return api.get(`/cortes/${corteId}/${loteId}/lote`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}
