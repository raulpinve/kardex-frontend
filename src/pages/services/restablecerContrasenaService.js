import {api}from '../../utils/authUtils'

const solicitarRestablecer = (data) => {
    const request = api.post(`/auth/solicitud-restablecer-contrasena`, data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

const restablecerContrasena = (data) => {
    const request = api.post(`/auth/restablecer-contrasena`, data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

export {
    solicitarRestablecer, 
    restablecerContrasena
}