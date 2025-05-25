import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CardStockInformation from "@/shared/components/CardStockInformation";
import { obtenerProducto } from "../../services/productoServices";

const TarjetasStockProducto = ({productoId}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [producto, setProducto] = useState();
    const token = useSelector(state => state.auth.token);

    // Obtener información del producto en el corte
    useEffect(() => {
        const fetchProductoCorte = async () => {
            setLoading(true)
            try {
                const res = await obtenerProducto(token,productoId);
                setProducto(res.data);
            } catch (error) {
                setError(error.response.data.message || "Ha ocurrido un error interno al intentar obtener la información del stock.")
            } finally {
                setLoading(false);
            }
        };

        if(!productoId) return
        fetchProductoCorte()

        return () => {
            setError(null)
            setLoading(null)
        }
    }, [token, productoId])

    if(error) return;
    return (
        <>
            <div className="grid md:grid-cols-3 gap-4">
                {/* Stock requerido */}
                <CardStockInformation 
                    titulo={`Stock requerido`}
                    value={producto?.stockRequerido}
                    tipo="stockRequerido"
                    loading={loading}
                />

                {/* Stock disponible */}
                <CardStockInformation 
                    titulo={`Stock disponible`}
                    tipo="stockFinal"
                    value={producto?.stockDisponible}
                    loading={loading}
                />

                {/* Pedidos */}
                <CardStockInformation 
                    titulo={`Cantidad a pedir`}
                    tipo="cantidadPedir"
                    value={producto?.stockStatus}
                    loading={loading}
                />
            </div>
        </>
    );
};

export default TarjetasStockProducto;
