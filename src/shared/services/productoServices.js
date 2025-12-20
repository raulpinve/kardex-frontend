import {api}from "@/utils/authUtils";

const obtenerProductos = (token ,almacenId, consulta) => {
    const request = api.get(`/productos/${almacenId}/almacen`, {
        params: {
            ...(consulta && { consulta }),
            tamanoPagina: 3
        }
    });
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
} 

export {
    obtenerProductos
}