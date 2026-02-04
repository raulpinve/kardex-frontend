import {api}from '../../utils/authUtils'

const verificarEmail = ( data) => {
    const request = api.post(`/auth/verificar-email`, data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

export {
    verificarEmail
}