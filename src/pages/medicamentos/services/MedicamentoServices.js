import { apiClient } from "../../../utils/authUtils";

const obtenerAvatarMedicamento = (token, medicamentoId) => {
    return apiClient(token).get(`/medicamentos/${medicamentoId}/avatar`)
    .then(response => response.data)
    .catch(err => {
        throw err;
    });
};

const subirAvatar = (token, medicamentoId, archivo) => {
    const formData = new FormData();
    formData.append("avatar", archivo);

    return apiClient(token).put(`/medicamentos/${medicamentoId}/avatar`, formData)
    .then(response => response.data)
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