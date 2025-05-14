import React, { useEffect, useState } from "react";
import { LuListStart, LuPackageOpen, LuPackagePlus } from "react-icons/lu";
import SkeletonElement from "../../../../shared/components/SkeletonElement";
import { obtenerProductoCorte } from "../../services/productoServices";
import { useSelector } from "react-redux";
import { obtenerLoteCorte } from "../../services/loteServices";

const StockStatus = ({ stockRequerido, stockFinal }) => {
    const cantidadApedir = stockFinal- stockRequerido;
  
    // Función que genera el estilo y el mensaje según el estado
    const renderStockStatus = () => {
        if (cantidadApedir < 0) {
            return {
                text: `${cantidadApedir} unidades`,
                bgColor: "bg-red-200 dark:bg-gray-900",
                textColor: "text-red-600",
            };
        }
    
        return {
            text: `${cantidadApedir === 0 ? "Perfecto" : `+ ${cantidadApedir}`} unidades`,
            bgColor: "bg-green-200 dark:bg-gray-900",
            textColor: "text-green-800",
        };
    }
  
    const { text, bgColor, textColor } = renderStockStatus();
    
    return (<span className={`absolute right-4 bottom-4 gap-1 rounded-full py-0.5 pl-2 pr-2.5 text-sm font-medium ${bgColor} ${textColor}`}>
        {text}  
    </span>);
};

const CardInformacion = ({titulo, stock, loading, tipo = undefined}) => {
    let value, icon;

    if(tipo === "cantidadPedir"){
        icon = <LuPackagePlus />;
        value = Math.max((stock?.stockRequerido ?? 0) - (stock?.stockFinal ?? 0), 0);
    }else if(tipo === "stockInicial"){
        value = stock?.stockInicial;
        icon = <LuListStart />;
    } else if(tipo === "stockFinal"){
        value = stock?.stockFinal;
        icon = <LuPackageOpen />;
    } 

    if(!tipo) return

    return (<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative flex items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-200 text-xl">
            {icon}
        </div>
        <div className="mt-0 flex items-end justify-between pl-4">
            <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{titulo}</span>
                <h4 className=" text-3xl font-bold text-gray-800 dark:text-white/90">
                    {loading ? (
                        <SkeletonElement className="mt-2"/>
                    ): (
                        <span>{value}</span>
                    )}
                </h4>
            </div>
        </div>
        {tipo === "cantidadPedir"
            && stock?.stockRequerido != null
            && stock?.stockFinal != null
            && (
                <StockStatus
                stockRequerido={stock.stockRequerido}
                stockFinal={stock.stockFinal}
                />
        )}
    </div>)
}

const TarjetasInformacionStock = ({corteId, loteId}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [stock, setStock] = useState();
    const token = useSelector(state => state.auth.token);

    // Obtener información del producto en el corte
    useEffect(() => {
        const fetchProductoCorte = async () => {
            setLoading(true)
            try {
                const res = await obtenerLoteCorte(token, corteId, loteId);
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
    }, [corteId, token, loteId])

    if(error) return

    return (
        <>
            <div className="grid grid-cols-3 xl:gap-4 2xl:gap-6">
                {/* Stock inicial */}
                <CardInformacion 
                    titulo={`Stock inicial`}
                    tipo="stockInicial"
                    stock={stock}
                    loading={loading}
                />
                
                {/* Stock final */}
                <CardInformacion 
                    titulo={`Stock final`}
                    tipo="stockFinal"
                    stock={stock}
                    loading={loading}
                />

                {/* Cantidad a pedir */}
                <CardInformacion 
                    titulo={`Cantidad a pedir`}
                    stock={stock}
                    tipo="cantidadPedir"
                    loading={loading}
                />
            </div>
        </>
    );
};

export default TarjetasInformacionStock;