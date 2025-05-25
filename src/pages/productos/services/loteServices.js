import { apiClient } from "../../../utils/authUtils";

const obtenerLotes = (token, tipo, medicamentoId, pagina = 1, consulta) => {
    const request = apiClient(token).get(`/lotes/${medicamentoId}/${tipo === "medicamentos" ? "medicamento": "dispositivo"}`, {
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

const obtenerLote = (token, loteId) => {
    const request = apiClient(token).get(`/lotes/${loteId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const crearLote = (token, data) => {
    const request = apiClient(token).post(`/lotes`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarLote = (token, loteId, data) => {
    const request = apiClient(token).put(`/lotes/${loteId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarLote = (token, loteId, data) => {
    const request = apiClient(token).delete(`/lotes/${loteId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerLotes,
    crearLote, 
    editarLote,
    obtenerLote,
    eliminarLote
}