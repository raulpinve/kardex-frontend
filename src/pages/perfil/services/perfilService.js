import { apiClient } from "../../../utils/authUtils";

const actualizarPerfil = (token, data) => {
    const request = apiClient(token).put(`/perfiles`, data)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    actualizarPerfil
}