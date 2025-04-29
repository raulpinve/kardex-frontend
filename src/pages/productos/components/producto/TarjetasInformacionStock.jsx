import React from "react";
import { LuListStart, LuPackageOpen, LuPackagePlus } from "react-icons/lu";
import SkeletonElement from "../../../../shared/components/SkeletonElement";

const StockStatus = ({ stockRequerido, stockFinal }) => {
    const cantidadApedir = stockFinal- stockRequerido;
    if(isNaN(cantidadApedir)) return;
  
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

const CardInformacion = ({titulo, producto, loading, tipo = undefined}) => {
    let value, icon;
    if(tipo === "cantidadPedir"){
        icon = <LuPackagePlus />;
        value = Math.max((producto?.stockRequerido ?? 0) - (producto?.stockFinal ?? 0), 0);
    }else if(tipo === "stockRequerido"){
        value = producto?.stockRequerido;
        icon = <LuListStart />;
    } else if(tipo === "stockDisponible"){
        value = producto?.stockDisponible;
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
        {tipo === "cantidadPedir" && !loading && (
            <StockStatus stockRequerido={producto?.stockRequerido} stockFinal={producto?.stockDisponible}/>
        )}
    </div>)
}

const TarjetasInformacionStock = ({ producto, loading, error }) => {
    if(error) return
    return (
        <>
            <div className="grid grid-cols-3 gap-4 2xl:gap-6">
                {/* Stock requerido */}
                <CardInformacion 
                    titulo={`Stock requerido`}
                    tipo="stockRequerido"
                    producto={producto}
                    loading={loading}
                />
                
                {/* Stock disponible */}
                <CardInformacion 
                    titulo={`Stock disponible`}
                    tipo="stockDisponible"
                    producto={producto}
                    loading={loading}
                />

                {/* Cantidad a pedir */}
                <CardInformacion 
                    titulo={`Cantidad a pedir`}
                    producto={producto}
                    tipo="cantidadPedir"
                    loading={loading}
                />
            </div>
        </>
    );
};

export default TarjetasInformacionStock;