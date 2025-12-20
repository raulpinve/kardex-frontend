import {api}from "../../../utils/authUtils";

const obtenerLotes = (token, tipo, medicamentoId, pagina = 1, consulta) => {
    const request = api.get(`/lotes/${medicamentoId}/${tipo === "medicamentos" ? "medicamento": "dispositivo"}`, {
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
    const request = api.get(`/lotes/${loteId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const crearLote = (token, data) => {
    const request = api.post(`/lotes`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarLote = (token, loteId, data) => {
    const request = api.put(`/lotes/${loteId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarLote = (token, loteId, data) => {
    const request = api.delete(`/lotes/${loteId}`, data);
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