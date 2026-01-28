import React, { useEffect, useState } from "react";
import CardStockInformation from "@/shared/components/CardStockInformation";
import { obtenerResumenLoteCorte } from "../../services/lotesServices";

const TarjetasInformacionStockLote = ({corteId, loteId, refreshStock}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [stock, setStock] = useState();

    // Obtener información del producto en el corte
    useEffect(() => {
        const fetchProductoCorte = async () => {
            setLoading(true)
            try {
                const res = await obtenerResumenLoteCorte(corteId, loteId);
                setStock(res.data);
            } catch (error) {
                setError(error.response.data.message || "Ha ocurrido un error interno al intentar obtener la información del stock.")
            } finally {
                setLoading(false);
            }
        };

        if(!corteId || !loteId) return
        fetchProductoCorte()

        return () => {
            setError(null)
            setLoading(null)
        }
    }, [corteId, loteId, refreshStock])
    
    if(error) return
    return (
        <>
            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Stock inicial */}
                <CardStockInformation 
                    titulo={`Stock inicial`}
                    value={stock?.stockInicial}
                    tipo="stockInicial"
                    loading={loading}
                />

                {/* Ingresos */}
                <CardStockInformation 
                    titulo={`Ingresos`}
                    tipo="ingresos"
                    value={stock?.ingresos}
                    loading={loading}
                />

                {/* Salidas */}
                <CardStockInformation 
                    titulo={`Salidas`}
                    tipo="salidas"
                    value={stock?.salidas}
                    loading={loading}
                />
                
                {/* Stock final */}
                <CardStockInformation 
                    titulo={`Stock final`}
                    tipo="stockFinal"
                    value={stock?.stockFinal}
                    loading={loading}
                />

            </div>
        </>
    );
};

export default TarjetasInformacionStockLote;