import {api}from "../../../utils/authUtils";

const obtenerProductosCorte = (token, corteId, tipo, pagina = 1, consulta, categoriaId) => {
    const request = api.get(`/cortes/${corteId}/${tipo}`, {
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

const obtenerProductoCorte = (token, corteId, productoId) => {
    return api.get(`/cortes/${corteId}/${productoId}/producto`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

const obtenerProducto = (token, productoId) => {
    return api.get(`/productos/${productoId}`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

export {
    obtenerProductoCorte, 
    obtenerProductosCorte,
    obtenerProducto
}