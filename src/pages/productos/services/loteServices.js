import {api}from '../../../utils/authUtils';

export const obtenerLote = (loteId) => {
    return api.get(`/lotes/${loteId}`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

export const obtenerLotes = (productoId, pagina = 1, consulta) => {
    const request = api.get(`/lotes/producto/${productoId}`, {
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

export const obtenerEvolucionLote = (loteId, fechas) => {
    const [fecha_inicio, fecha_fin] = fechas;

    return api.get(`/lotes/${loteId}/evolucion`, {
        params: {
            fecha_inicio,
            fecha_fin
        }
    })
    .then(res => res.data);
};
