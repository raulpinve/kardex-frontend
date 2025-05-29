import { apiClient } from "../../utils/authUtils";

const obtenerAlertasVencimiento = (token,almacenId) => {
    const request = apiClient(token).get(`/lotes/${almacenId}/alertas_vencimiento`)
        return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}
export {
    obtenerAlertasVencimiento
}
