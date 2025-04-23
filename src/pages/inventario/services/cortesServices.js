import { apiClient } from "../../../utils/authUtils";

const obtenerCortes = (token, almacenId, pagina = 1, consulta) => {
    const request = apiClient(token).get(`/cortes/${almacenId}/almacen`, {
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

const crearCorte = (token, data) => {
    const request = apiClient(token).post(`/cortes`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerCorte = (token, corteId) => {
    const request = apiClient(token).get(`/cortes/${corteId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerCortes,
    crearCorte,
    obtenerCorte
}