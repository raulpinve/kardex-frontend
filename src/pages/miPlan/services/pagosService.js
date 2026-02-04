import { api } from "../../../utils/authUtils";

export const crearReferenciaPago = (plan, periodo) => {
    const request = api.post(`/pagos/crear-referencia`, {
      plan, periodo
    });
    return request
      .then(response => response.data)
      .catch(err => {
          throw err
      })
};
