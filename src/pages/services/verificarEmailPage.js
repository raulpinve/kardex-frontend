import {api}from '../../utils/authUtils'

const verificarEmail = (token, data) => {
    const request = api.post(`/verificar-email`, data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

export {
    verificarEmail
}