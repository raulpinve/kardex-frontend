import { apiClient } from "../../../utils/authUtils";

const obtenerMedicamentos = (token, almacenId, pagina = 1, consulta) => {
    const request = apiClient(token).get(`/medicamentos/${almacenId}/almacen`, {
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

const obtenerMedicamento = (token, medicamentoId) => {
    const request = apiClient(token).get(`/medicamentos/${medicamentoId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const crearMedicamento = (token, data) => {
    const request = apiClient(token).post(`/medicamentos`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarMedicamento = (token, medicamentoId, data) => {
    const request = apiClient(token).put(`/medicamentos/${medicamentoId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}
const eliminarMedicamento = (token, medicamentoId) => {
    const request = apiClient(token).delete(`/medicamentos/${medicamentoId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerMedicamentos,
    obtenerMedicamento, 
    crearMedicamento,
    editarMedicamento,
    eliminarMedicamento
}