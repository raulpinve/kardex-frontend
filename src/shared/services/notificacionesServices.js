import { apiClient } from "../../utils/authUtils";

const obtenerNotificaciones = (token, almacenId, pagina) => {
    const request = apiClient(token).get(`/notificaciones/${almacenId}`, {
        params: {
            ...(pagina && { pagina })
        }
    });
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerNotificaciones
}