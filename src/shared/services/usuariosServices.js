import {api}from "../../utils/authUtils";

export const obtenerListadoUsuarios = () => {
    const request = api.get(`/usuarios`, {
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