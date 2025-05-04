import { apiClient } from "../../utils/authUtils";

const obtenerInformacionHistorial = (token,tipo, id, mes) => {
    const request = apiClient(token).get(`/cortes/${id}/${tipo}?mes=${mes}`)
        return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}
export {
    obtenerInformacionHistorial,
}