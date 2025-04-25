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

const obtenerCorteLote = (token, loteId, productoId) => {
    return apiClient(token).get(`/cortes/${loteId}/${productoId}/producto`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

const obtenerCorteLotes = (token, corteId, productoId, pagina, consulta) => {
    return apiClient(token).get(`/cortes/${corteId}/${productoId}/lotes`, {
        params: {
            pagina,
            ...(consulta && { consulta })
        }
    })
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

export {
    obtenerCortes,
    crearCorte,
    obtenerCorte,
    obtenerCorteLote,
    obtenerCorteLotes
}