import { apiClient } from '../../../utils/authUtils';

const obtenerProductos = (token ,tipo, almacenId,pagina = 1, consulta, categoriaId) => {
    const request = apiClient(token).get(`/${tipo}/${almacenId}/almacen`, {
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

const crearProducto = (token, data, tipo) => {
    const request = apiClient(token).post(`/${tipo}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerProducto = (token, productoId) => {
    return apiClient(token).get(`/productos/${productoId}`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

const obtenerStockDisponible = (token, productoId) => {
    return apiClient(token).get(`/productos/${productoId}/stock_disponible`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

const editarProducto = (token, tipo, productoId, data) => {
    const request = apiClient(token).put(`/${tipo}/${productoId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarProducto = (token, tipo, productoId) => {
    const request = apiClient(token).delete(`/${tipo}/${productoId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const subirAvatar = (token, tipo, productoId, archivo) => {
    const formData = new FormData();
    formData.append("avatar", archivo);

    return apiClient(token).put(`/${tipo}/${productoId}/avatar`, formData)
    .then(response => response.data)
        .catch(err => {
            throw err;
        });
};

const eliminarAvatar = (token, tipo, productoId) => {
    return apiClient(token).delete(`/${tipo}/${productoId}/avatar`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
};

export {
    obtenerProductos,
    obtenerProducto,
    obtenerStockDisponible,
    crearProducto,
    editarProducto,
    eliminarProducto,
    subirAvatar,
    eliminarAvatar
}