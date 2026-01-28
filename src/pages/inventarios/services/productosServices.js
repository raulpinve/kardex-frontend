import {api}from "../../../utils/authUtils";

export const obtenerProductosCorte = (corteId, tipo, pagina = 1, consulta, categoriaId) => {
    const request = api.get(`/cortes/${corteId}/${tipo}/productos`, {
        params: {
            pagina,
            categoriaId,
            ...(consulta && { consulta })
        }
    });
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const obtenerProducto = (tipo, productoId) => {
    return api.get(`/${tipo}/${productoId}`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

export const obtenerResumenProductoCorte = (corteId, productoId) => {
    return api.get(`/cortes/${corteId}/${productoId}/producto`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}