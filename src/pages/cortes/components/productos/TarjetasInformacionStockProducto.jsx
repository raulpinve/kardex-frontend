import React, { useEffect, useState } from "react";
import CardStockInformation from "@/shared/components/CardStockInformation";
import { obtenerResumenProductoCorte } from "../../services/productosServices";
import { formatCantidad } from "@/utils/utilities";

const TarjetasInformacionStockProducto = ({corteId, productoId}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [stock, setStock] = useState();

    // Obtener información del producto en el corte
    useEffect(() => {
        const fetchProductoCorte = async () => {
            setLoading(true)
            try {
                const res = await obtenerResumenProductoCorte(corteId, productoId);
                setStock(res.data);
            } catch (error) {
                setError(error.response.data.message || "Ha ocurrido un error interno al intentar obtener la información del stock.")
            } finally {
                setLoading(false);
            }
        };

        if(!corteId || !productoId) return
        fetchProductoCorte()

        return () => {
            setError(null)
            setLoading(null)
        }
    }, [corteId, productoId])

    if(error) return

    return (
        <>
            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Stock inicial */}
                <CardStockInformation 
                    titulo={`Stock inicial`}
                    value={formatCantidad(stock?.stockInicial)}
                    tipo="stockInicial"
                    loading={loading}
                />

                {/* Ingresos */}
                <CardStockInformation 
                    titulo={`Ingresos`}
                    tipo="ingresos"
                    value={formatCantidad(stock?.ingresos)}
                    loading={loading}
                />

                {/* Salidas */}
                <CardStockInformation 
                    titulo={`Salidas`}
                    tipo="salidas"
                    value={formatCantidad(stock?.salidas)}
                    loading={loading}
                />
                
                {/* Stock final */}
                <CardStockInformation 
                    titulo={`Stock final`}
                    tipo="stockFinal"
                    value={formatCantidad(stock?.stockFinal)}
                    loading={loading}
                />
            </div>
        </>
    );
};

export default TarjetasInformacionStockProducto;