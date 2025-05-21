import React from 'react';
import { LuFileInput, LuFileOutput, LuListStart, LuPackageOpen, LuPackagePlus } from 'react-icons/lu';
import SkeletonElement from './SkeletonElement';

const StockStatus = ({ value }) => {
    const cantidadApedir = value;
  
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
    
    return (<span className={`absolute right-4 bottom-4 gap-1 rounded-full py-0.5 pl-2 pr-2.5 text-xs font-medium ${bgColor} ${textColor}`}>
        {text}  
    </span>);
};


const CardStockInformation = ({titulo, loading, tipo = undefined, value}) => {
    let icon;

    if(tipo === "stockInicial"){
        icon = <LuListStart />;
    } else if(tipo === "stockFinal"){
        icon = <LuPackageOpen />;
    } else if(tipo === "ingresos"){
        icon = <LuFileInput />;
    } else if(tipo === "salidas"){
        icon = <LuFileOutput />;
    }

    return (<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 relative flex items-center">
        <div className="hidden xl:flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-200 text-xl">
            {icon}
        </div>
        <div className="flex items-end justify-between pl-4">
            <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{titulo}</span>
                <h4 className="mt-1 text-3xl font-bold text-gray-800 dark:text-white/90">
                    {loading ? (
                            <SkeletonElement className="mt-2" />
                        ) : (
                        <span>
                            {tipo === "cantidadPedir" 
                            ? Math.max(0, Math.abs(value)) 
                            : value}
                        </span>
                    )}

                </h4>
            </div>
        </div>
        {tipo === "cantidadPedir"
            && (
                <StockStatus
                    value={value}
                />
            )}
    </div>)
};

export default CardStockInformation;