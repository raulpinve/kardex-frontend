import { apiClient } from "../../../utils/authUtils";

const obtenerCorteActivoMedicamentos = (token, almacenId, pagina = 1, consulta) => {
    const request = apiClient(token).get(`/cortes/activo/${almacenId}/medicamentos`, {
        params: {
            pagina,
            ...(consulta && { consulta })
        }
    });
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
} 

export {
    obtenerCorteActivoMedicamentos
}