import { apiClient } from '../../utils/authUtils'

const verificarEmail = (token, data) => {
    const request = apiClient(token).post(`/verificar-email`, data)
    return request
    .then(response => response.data)
    .catch(err => {
       throw err
    })
}

export {
    verificarEmail
}