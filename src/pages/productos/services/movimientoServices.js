import { apiClient } from "../../../utils/authUtils";

const obtenerCorteMovimientosLote = (token, corteId, loteId, tipo, fecha, pagina, consulta) => {
    const request = apiClient(token).get(`/cortes/${corteId}/${loteId}/movimientos`, {
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

const obtenerMovimientosLote = (token, loteId, tipo, fecha, pagina, consulta) => {
    const request = apiClient(token).get(`/movimientos/${loteId}/lote`, {
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

// Movimientos por producto dentro de un corte
const obtenerCorteMovimientosProducto = (token, corteId, productoId, tipo, fecha, pagina, consulta) => {
    return apiClient(token).get(`/cortes/${corteId}/productos/${productoId}/movimientos`, {
        params: {
            pagina,
            ...(consulta && { consulta }),
            ...(tipo && { tipo }),
            ...(fecha && { fecha }),
        }
    })
    .then(res => res.data)
    .catch(err => { throw err });
}

// Movimientos por producto sin corte
const obtenerMovimientosProducto = (token, productoId, tipo, fecha, pagina, consulta) => {
    return apiClient(token).get(`/movimientos/productos/${productoId}`, {
        params: {
            pagina,
            ...(consulta && { consulta }),
            ...(tipo && { tipo }),
            ...(fecha && { fecha }),
        }
    })
    .then(res => res.data)
    .catch(err => { throw err });
}

const crearMovimiento = (token, data) => {
    const request = apiClient(token).post(`/movimientos`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarMovimiento = (token, movimientoId, data) => {
    const request = apiClient(token).put(`/movimientos/${movimientoId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarMovimiento = (token, movimientoId) => {
    const request = apiClient(token).delete(`/movimientos/${movimientoId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerMovimientosLote,
    obtenerCorteMovimientosLote,
    crearMovimiento,
    editarMovimiento,
    eliminarMovimiento,
    obtenerCorteMovimientosProducto,
    obtenerMovimientosProducto
}