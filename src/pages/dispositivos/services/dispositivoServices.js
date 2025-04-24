import { apiClient } from "../../../utils/authUtils";

const obtenerAvatarDispositivo = (token, dispositivoId) => {
    return apiClient(token).get(`/dispositivos/${dispositivoId}/avatar`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
};

const subirAvatar = (token, dispositivoId, archivo) => {
    const formData = new FormData();
    formData.append("avatar", archivo);

    return apiClient(token).put(`/dispositivos/${dispositivoId}/avatar`, formData)
    .then(response => response.data)
        .catch(err => {
            throw err;
        });
};

const eliminarAvatar = (token, dispositivoId) => {
    return apiClient(token).delete(`/dispositivos/${dispositivoId}/avatar`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
};

export {
    obtenerAvatarDispositivo, 
    subirAvatar,
    eliminarAvatar
}