import { obtenerCorte } from "./services/cortesServices";
import { useParams } from "react-router-dom";
import Productos from "./components/productos/Productos";
import Spinner from "../../shared/components/Spinner";
import React, { useEffect, useState } from "react";
import ErrorPage from "@/shared/components/ErrorPage";

const InventariosListadoProductosPagina = () => {
    const {corteId} = useParams();
    const [corte, setCorte]= useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    // Obtener la información del corte
    useEffect(() => {
        const fetchCorte = async () => {
            try {
                setLoading(true);
                const res = await obtenerCorte(corteId);
                setCorte(res.data);
            } catch (error) {
                const statusCode = error?.response?.data?.statusCode || 500;
                const message = error?.response?.data?.message || 'Ha ocurrido un error interno';
                setError({ code: statusCode, message });
            } finally {
                setLoading(null)
            }
        }
        if(corteId) fetchCorte();
    }, [corteId])

    if(loading){
        return <Spinner className={`mt-4`}/>
    }
    if(error){
        return <ErrorPage {...error} />
    }

    return (
        <>
            {/* Titulo de la página */}
            <div className="gap-2 mt-3">
                <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-semibold">Kardex</h1>
                <p className="dark:text-gray-500 text-gray-700">{corte?.nombre}</p>
            </div>

            {corte && (
                <div className="mt-6">
                    <Productos tipo="medicamentos" corteId={corteId} />
                    <Productos tipo="dispositivos" corteId={corteId} />
                </div>
            )}
        </>
    );
};

export default InventariosListadoProductosPagina;