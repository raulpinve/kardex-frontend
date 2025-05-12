import { apiClient } from "../../../utils/authUtils";

const obtenerCortes = (token, almacenId, pagina = 1, consulta) => {
    const request = apiClient(token).get(`/cortes/${almacenId}/almacen`, {
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

const crearCorte = (token, data) => {
    const request = apiClient(token).post(`/cortes`, data);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerCorte = (token, corteId) => {
    const request = apiClient(token).get(`/cortes/${corteId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const cerrarCorte = (token, corteId) => {
    const request = apiClient(token).put(`/cortes/${corteId}/cerrar`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerFechaCorte = (token, almacenId, periodo, diaInicioSemana) => {
    const request = apiClient(token).get(`/cortes/fechas/${almacenId}`, {
        params: {
            ...(periodo && { periodo }),
            ...(diaInicioSemana && { dia_inicio_semana: diaInicioSemana }),
        }
    });
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

const obtenerCorteLote = (token, corteId, loteId) => {
    return apiClient(token).get(`/cortes/${corteId}/${loteId}/lote`)
        .then(response => response.data)
        .catch(err => {
            throw err;
        });
}

const obtenerCorteLotes = (token, corteId, productoId, pagina, consulta) => {
    return apiClient(token).get(`/cortes/${corteId}/${productoId}/lotes`, {
        params: {
            pagina,
            ...(consulta && { consulta })
        }
    })
    .then(response => response.data)
    .catch(err => {
        throw err;
    });
}

const eliminarCorte = (token, corteId) => {
    const request = apiClient(token).delete(`/cortes/${corteId}`);
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export {
    obtenerCortes,
    crearCorte,
    cerrarCorte,
    obtenerCorte,
    obtenerFechaCorte,
    obtenerCorteLote,
    obtenerCorteLotes,
    eliminarCorte
}