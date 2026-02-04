import { api } from "../../utils/authUtils";

export const confirmarDesbloqueoSuscripcion = (payload) => {
  return api.post(`/suscripciones/confirmar-desbloqueo`, payload)
    .then(response => response.data)
    .catch(err => {
      throw err;
    });
};
