import { apiClient } from "../../../utils/authUtils";

const obtenerAlmacenes = (token) => {
    const request = apiClient(token).get(`/almacenes`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
} 

export {
    obtenerAlmacenes
}