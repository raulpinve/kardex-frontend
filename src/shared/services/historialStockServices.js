import {api}from "../../utils/authUtils";

const obtenerInformacionHistorial = (tipo, id, fechasFormateadas) => {
    const [fecha_inicio, fecha_fin] = fechasFormateadas || [];

    const request = api.get(`/${tipo}/${id}/evolucion`, {
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
const obtenerEvolucionProducto = (tipo, id) => {
    const request = api.get(`/cortes/${id}/${tipo}/cortes`)
        return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerEvolucionProductoCorte = (tipo, id, corteId) => {
    const request = api.get(`/cortes/${corteId}/${tipo}/${id}/evolucion`)
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