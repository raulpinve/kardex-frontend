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

const obtenerNotificacionesNoVistas = (token, almacenId, pagina) => {
    const request = apiClient(token).get(`/notificaciones/${almacenId}/notificaciones_no_vistas`, {
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
const marcarNotificacionesComoLeidas = (token, almacenId) => {
    const request = apiClient(token).post(`/notificaciones/${almacenId}/vistas`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerNotificaciones,
    obtenerNotificacionesNoVistas,
    marcarNotificacionesComoLeidas
}