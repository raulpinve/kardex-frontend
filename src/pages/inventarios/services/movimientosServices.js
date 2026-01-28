import {api}from "../../../utils/authUtils";

export const crearMovimiento = ( data) => {
    const request = api.post(`/movimientos`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const editarMovimiento = (movimientoId, data) => {
    const request = api.put(`/movimientos/${movimientoId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const obtenerMovimientosLotesCorte = (corteId, loteId, tipo, fecha, pagina, consulta) => {
    const request = api.get(`/cortes/${corteId}/lotes/${loteId}/movimientos`, {
            params: {
                pagina,
                ...(consulta && { consulta }),
                ...(tipo && { tipo }),
                ...(fecha && { fecha }),
            }
        }
    );
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const eliminarMovimiento = (movimientoId) => {
    const request = api.delete(`/movimientos/${movimientoId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}
