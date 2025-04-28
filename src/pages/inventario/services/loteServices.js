import { apiClient } from "../../../utils/authUtils";

const obtenerCorte = (token, corteId, productoId) => {
    const request = apiClient(token).get(`/cortes/${corteId}/${productoId}/lote`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerCorte,
}