import { apiClient } from '../../utils/authUtils'

const solicitarRestablecer = (token, data) => {
    const request = apiClient(token).post(`/solicitud-restablecer-contrasena`, data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

const restablecerContrasena = (token, data) => {
    const request = apiClient(token).post(`/restablecer-contrasena`, data)
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