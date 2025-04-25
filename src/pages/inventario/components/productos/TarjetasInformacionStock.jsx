import React from "react";
import { LuListStart, LuPackageCheck, LuPackageOpen, LuPackagePlus } from "react-icons/lu";
import SkeletonElement from "../../../../shared/components/SkeletonElement";

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
            text: `${cantidadApedir === 0 ? "Perfecto" : `+ ${cantidadApedir} unidades`}`,
            bgColor: "bg-green-200 dark:bg-gray-900",
            textColor: "text-green-800",
        };
    }
  
    const { text, bgColor, textColor } = renderStockStatus();
  
    return (
        <span className={`absolute right-0 bottom-0 gap-1 rounded-full py-0.5 pl-2 pr-2.5 text-sm font-medium ${bgColor} ${textColor}`}>
            {text}
        </span>
    );
};

const TarjetasInformacionStock = ({ stock, loading, error }) => {
    return (
        <>
            {error ? (<div className="">
                <p className="text-center text-gray-700 dark:text-gray-200">{error}</p>
            </div>):(
                <div className="grid grid-cols-2 gap-4">
                    {/* Stock requerido */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-xl">
                            <LuPackageCheck />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Stock requerido</span>
                                <h4 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
                                    {loading ? (
                                        <SkeletonElement className="mt-2"/>
                                    ): (
                                        <span>{stock?.stockRequerido}</span>
                                    )}
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* Stock inicial */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-xl">
                            <LuListStart />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Stock inicial</span>
                                <h4 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
                                    {loading ? (
                                        <SkeletonElement className="mt-2"/>
                                    ): (
                                        <span>{stock?.stockInicial}</span>
                                    )}
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* Stock disponible */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-xl">
                            <LuPackageOpen />
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Stock disponible</span>
                                <h4 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
                                    {loading ? (
                                        <SkeletonElement className="mt-2"/>
                                    ): (
                                        <span>{stock?.stockFinal}</span>
                                    )}
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* Cantidad a pedir  */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-xl">
                            <LuPackagePlus />
                        </div>
                        <div className="mt-5 flex items-end justify-between relative">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Cantidad a pedir </span>
                                <h4 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
                                    {loading ? (
                                        <SkeletonElement className="mt-2"/>
                                    ): (
                                        <span>{Math.abs((stock?.stockRequerido ?? 0) - (stock?.stockFinal ?? 0))}</span>
                                    )}
                                </h4>
                            </div>
                            {!loading &&(
                                <StockStatus stockRequerido={stock?.stockRequerido} stockFinal={stock?.stockFinal}/>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TarjetasInformacionStock;