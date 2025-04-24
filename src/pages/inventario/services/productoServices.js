import { apiClient } from "../../../utils/authUtils";

const obtenerProductosCorte = (token, corteId, tipo, pagina = 1, consulta) => {
    const request = apiClient(token).get(`/cortes/${corteId}/${tipo}`, {
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

const obtenerProductoCorte = (token, corteId, productoId) => {
    return apiClient(token).get(`/cortes/${corteId}/${productoId}/producto`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

export {
    obtenerProductoCorte, 
    obtenerProductosCorte
}