import { apiClient } from "../../../utils/authUtils";

const obtenerUsuarios = (token, paginaActual) => {
    const request = apiClient(token).get(`/usuarios?pagina=${paginaActual}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
} 

const crearUsuario = (token, data) => {
    const request = apiClient(token).post('/usuarios/', data)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarUsuario = (token, usuarioId, data) => {
    const request = apiClient(token).put(`/usuarios/${usuarioId}`, data)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerPrivilegiosUsuario = (token, usuarioId) => {
    const request = apiClient(token).get(`/usuarios/${usuarioId}/privilegios-almacen`)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const actualizarPrivilegiosUsuario = (token, usuarioId, data) => {
    const request = apiClient(token).put(`/usuarios/${usuarioId}/privilegios-almacen`, data)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarUsuario = (token, usuarioId) => {
    const request = apiClient(token).delete(`/usuarios/${usuarioId}`)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerUsuarios,
    crearUsuario, 
    editarUsuario,
    obtenerPrivilegiosUsuario,
    actualizarPrivilegiosUsuario,
    eliminarUsuario
}