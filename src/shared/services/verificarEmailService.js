import {api}from "../../utils/authUtils";

const solicitarVerificarEmail = () => {
    const request = api.post('/perfiles/solicitud-verificar-email')
    return request
    .then(response => response.data)
    .catch(err => {
        throw err
    })
}

export {
    solicitarVerificarEmail
}