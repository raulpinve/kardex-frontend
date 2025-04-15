import { apiClient } from "../../../utils/authUtils";

const actualizarPerfil = (token, data) => {
    const request = apiClient(token).put(`/perfiles`, data)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const subirAvatar = (token, archivo) => {
    const formData = new FormData();
    formData.append("avatar", archivo);

    return apiClient(token).put(`/perfiles/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    .then(response => response.data)
    .catch(err => {
        throw err;
    });
};

const obtenerPerfil = (token, perfilId) => {
    const request = apiClient(token).get(`/perfiles/${perfilId}`)
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const cambiarContrasena = (token, data) => {
    const request = apiClient(token).put(`/perfiles/password`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const eliminarAvatar = (token) => {
    return apiClient(token).delete(`/perfiles/avatar`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
};

export {
    actualizarPerfil,
    subirAvatar,
    obtenerPerfil,
    cambiarContrasena,
    eliminarAvatar
}