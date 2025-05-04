import { apiClient } from "../../../utils/authUtils";

const obtenerLote = (token, loteId) => {
    const request = apiClient(token).get(`/lotes/${loteId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerLote
}