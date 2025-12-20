import {api}from "../../../utils/authUtils";

const crearMovimiento = (token, data) => {
    const request = api.post(`/movimientos`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarMovimiento = (token, movimientoId, data) => {
    const request = api.put(`/movimientos/${movimientoId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarMovimiento = (token, movimientoId) => {
    const request = api.delete(`/movimientos/${movimientoId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}


const obtenerCorteMovimientosLote = (token, corteId, loteId, tipo, fecha, pagina, consulta) => {
    const request = api.get(`/cortes/${corteId}/${loteId}/movimientos`, {
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

const obtenerCorteMovimientosProducto = (token, corteId, productoId, tipo, fecha, pagina, consulta) => {
    return api.get(`/cortes/${corteId}/productos/${productoId}/movimientos`, {
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


export {
    crearMovimiento,
    editarMovimiento,
    eliminarMovimiento,
    obtenerCorteMovimientosLote,
    obtenerCorteMovimientosProducto
}