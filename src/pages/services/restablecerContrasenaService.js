import {api}from '../../utils/authUtils'

const solicitarRestablecer = (token, data) => {
    const request = api.post(`/solicitud-restablecer-contrasena`, data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

const restablecerContrasena = (token, data) => {
    const request = api.post(`/restablecer-contrasena`, data)
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