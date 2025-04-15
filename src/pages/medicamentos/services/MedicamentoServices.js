import { apiClient } from "../../../utils/authUtils";

const obtenerAvatarMedicamento = (token, medicamentoId) => {
    return apiClient(token).get(`/medicamentos/${medicamentoId}/avatar/thumbnail`, {
        responseType: 'blob',
    })
    .then(response => URL.createObjectURL(response.data)) // convierte el blob en URL usable
    .catch(err => {
        throw err;
    });
};

const subirAvatar = (token, medicamentoId, archivo) => {
    const formData = new FormData();
    formData.append("avatar", archivo);

    return apiClient(token).put(`/medicamentos/${medicamentoId}/avatar`, formData, {
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

const eliminarAvatar = (token, medicamentoId) => {
    return apiClient(token).delete(`/medicamentos/${medicamentoId}/avatar`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
};

export {
    obtenerAvatarMedicamento, 
    subirAvatar,
    eliminarAvatar
}