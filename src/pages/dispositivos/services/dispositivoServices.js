import { apiClient } from "../../../utils/authUtils";

const obtenerAvatarDispositivo = (token, dispositivoId) => {
    return apiClient(token).get(`/dispositivos/${dispositivoId}/avatar/thumbnail`, {
        responseType: 'blob',
    })
    .then(response => URL.createObjectURL(response.data)) // convierte el blob en URL usable
    .catch(err => {
        throw err;
    });
};

const subirAvatar = (token, dispositivoId, archivo) => {
    const formData = new FormData();
    formData.append("avatar", archivo);

    return apiClient(token).put(`/dispositivos/${dispositivoId}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        responseType: 'arraybuffer',  // Asegúrate de recibir la respuesta como un buffer
    })
    .then(response => {
        // Convierte el buffer a un blob y luego a una URL de objeto
        const miniaturaBlob = new Blob([response.data], { type: "image/jpeg" });
        const miniaturaUrl = URL.createObjectURL(miniaturaBlob);
        return { archivo: { miniatura: miniaturaUrl } };
    })
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