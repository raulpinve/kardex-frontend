import {api}from "../../utils/authUtils";

const solicitarVerificarEmail = (token) => {
    const request = api.post('/solicitud-verificar-email')
    return request
    .then(response => response.data)
    .catch(err => {
        throw err
    })
}

export {
    solicitarVerificarEmail
}