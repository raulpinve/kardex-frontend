import {api}from "../../../utils/authUtils";

export const obtenerMovimientosLotesCorte = (corteId, loteId, tipo, fecha, pagina, consulta) => {
    const request = api.get(`/cortes/${corteId}/lotes/${loteId}/movimientos`, {
            params: {
                pagina,
                ...(consulta && { consulta }),
                ...(tipo && { tipo }),
                ...(fecha && { fecha }),
            }
        }
    );
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}

export const obtenerMovimientosProductosCorte = (corteId, productoId, tipo, fecha, pagina, consulta) => {
    const request = api.get(`/cortes/${corteId}/productos/${productoId}/movimientos`, {
            params: {
                pagina,
                ...(consulta && { consulta }),
                ...(tipo && { tipo }),
                ...(fecha && { fecha }),
            }
        }
    );
    return request
        .then(response => response.data)
        .catch(err => {
            throw err
        })
}
