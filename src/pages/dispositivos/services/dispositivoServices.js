import { apiClient } from "../../../utils/authUtils";

const obtenerDispositivos = (token, almacenId, pagina = 1, consulta) => {
    const request = apiClient(token).get(`/dispositivos/${almacenId}/almacen`, {
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

const obtenerDispositivo = (token, dispositivoId) => {
    const request = apiClient(token).get(`/dispositivos/${dispositivoId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const crearDispositivo = (token, data) => {
    const request = apiClient(token).post(`/dispositivos`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarDispositivo = (token, dispositivoId, data) => {
    const request = apiClient(token).put(`/dispositivos/${dispositivoId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}
const eliminarDispositivo = (token, dispositivoId) => {
    const request = apiClient(token).delete(`/dispositivos/${dispositivoId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerDispositivos,
    obtenerDispositivo, 
    crearDispositivo,
    editarDispositivo,
    eliminarDispositivo
}