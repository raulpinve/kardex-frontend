import { api } from "../../../utils/authUtils";

export const crearMovimiento = (data) => {
    const request = api.post(`/movimientos`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const obtenerMovimientosProductos = (productoId, tipo, fecha, pagina, consulta ) => {
    return api
    .get(`/movimientos/${productoId}/producto`, {
        params: {
            pagina,
            tipo,
            fecha,
            ...(consulta && { consulta })
        }
    })
    .then(res => res.data);
};

export const obtenerMovimientosLotes = (loteId, tipo, fecha, pagina, consulta ) => {
    return api
    .get(`/movimientos/${loteId}/lote`, {
        params: {
            pagina,
            tipo,
            fecha,
            ...(consulta && { consulta })
        }
    })
    .then(res => res.data);
};

export const editarMovimiento = (movimientoId, data) => {
    const request = api.put(`/movimientos/${movimientoId}`, data);
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
