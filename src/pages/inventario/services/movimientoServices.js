import { apiClient } from "../../../utils/authUtils";

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
    crearMovimiento,
    editarMovimiento,
    eliminarMovimiento
}