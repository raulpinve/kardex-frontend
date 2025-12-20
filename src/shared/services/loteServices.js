import {api}from "../../utils/authUtils";

const obtenerAlertasVencimiento = (token,almacenId) => {
    const request = api.get(`/lotes/${almacenId}/alertas_vencimiento`)
        return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}
export {
    obtenerAlertasVencimiento
}
