import { apiClient } from "../../../utils/authUtils";

const obtenerProductosCorte = (token, corteId, tipo, pagina = 1, consulta, categoriaId) => {
    const request = apiClient(token).get(`/cortes/${corteId}/${tipo}`, {
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
    return apiClient(token).get(`/cortes/${corteId}/${productoId}/producto`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

const obtenerProducto = (token, productoId) => {
    return apiClient(token).get(`/productos/${productoId}`)
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