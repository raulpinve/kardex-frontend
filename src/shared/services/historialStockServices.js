import { apiClient } from "../../utils/authUtils";

const obtenerInformacionHistorial = (token,tipo, id, fechasFormateadas) => {
    const [fecha_inicio, fecha_fin] = fechasFormateadas || [];

    const request = apiClient(token).get(`/cortes/${id}/${tipo}/evolucion`, {
        params: {
            ...(fecha_inicio && { fecha_inicio }),
            ...(fecha_fin && { fecha_fin })
        }
    })
        return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}
const obtenerEvolucionProducto = (token, tipo, id) => {
    const request = apiClient(token).get(`/cortes/${id}/${tipo}/cortes`)
        return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerEvolucionProductoCorte = (token, tipo, id, corteId) => {
    const request = apiClient(token).get(`/cortes/${corteId}/${tipo}/${id}/evolucion`)
        return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}
export {
    obtenerInformacionHistorial,
    obtenerEvolucionProducto,
    obtenerEvolucionProductoCorte
}