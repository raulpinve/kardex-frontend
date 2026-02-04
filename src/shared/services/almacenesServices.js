import {api}from "../../utils/authUtils";

export const obtenerListadoAlmacenes = () => {
    const request = api.get(`/almacenes`, {
        params: {
            tamanoPagina: 1000
        }
    })
        return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}