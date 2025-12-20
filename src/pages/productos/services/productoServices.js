import {api}from '../../../utils/authUtils';

const obtenerProductos = (token ,tipo, almacenId,pagina = 1, consulta, categoriaId) => {
    const request = api.get(`/${tipo}/${almacenId}/almacen`, {
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
    const request = api.post(`/${tipo}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerProducto = (token, productoId) => {
    return api.get(`/productos/${productoId}`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

const obtenerStockDisponible = (token, productoId) => {
    return api.get(`/productos/${productoId}/stock_disponible`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

const editarProducto = (token, tipo, productoId, data) => {
    const request = api.put(`/${tipo}/${productoId}`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarProducto = (token, tipo, productoId) => {
    const request = api.delete(`/${tipo}/${productoId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const subirAvatar = (token, tipo, productoId, archivo) => {
    const formData = new FormData();
    formData.append("avatar", archivo);

    return api.put(`/${tipo}/${productoId}/avatar`, formData)
    .then(response => response.data)
        .catch(err => {
            throw err;
        });
};

const eliminarAvatar = (token, tipo, productoId) => {
    return api.delete(`/${tipo}/${productoId}/avatar`)
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