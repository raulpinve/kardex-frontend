import {api}from "../../../utils/authUtils";

const obtenerUsuarios = (pagina = 1, consulta) => {
    const request = api.get(`/usuarios`, {
        params: {
            pagina,
            ...(consulta && { consulta })
        }
    });
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
} 

const crearUsuario = (data) => {
    const request = api.post('/usuarios/', data)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const editarUsuario = (usuarioId, data) => {
    const request = api.put(`/usuarios/${usuarioId}`, data)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerPrivilegiosUsuario = (usuarioId) => {
    const request = api.get(`/usuarios/${usuarioId}/privilegios-almacen`)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const actualizarPrivilegiosUsuario = (usuarioId, data) => {
    const request = api.put(`/usuarios/${usuarioId}/privilegios-almacen`, data)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarUsuario = (usuarioId) => {
    const request = api.delete(`/usuarios/${usuarioId}`)
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