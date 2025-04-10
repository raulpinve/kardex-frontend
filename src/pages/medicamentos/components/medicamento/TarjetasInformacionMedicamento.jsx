import React from 'react';
import { LuBox, LuPackageCheck, LuPackageOpen, LuPackagePlus, LuShoppingBag, LuTarget } from 'react-icons/lu';

const TarjetasInformacionMedicamento = ({medicamento, loading, error}) => {
    return (
        <div className='grid gap-4'>
{           /* Loading */}
            {loading && (<div className='grid grid-cols-3 gap-4'>
                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-[98px] rounded-2xl mb-3"></div>
                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-[98px] rounded-2xl mb-3"></div>
                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-[98px] rounded-2xl mb-3"></div>
            </div>)}

            {!loading && !error && medicamento && ( <div className='grid grid-cols-3 gap-4 mb-4'>
                {/* Stock requerido */}
                <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 flex items-center gap-4">
                    <div className="flex text-xl h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                        <LuPackageCheck />
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Stock requerido</span>
                            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                                {medicamento.stockRequerido}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Stock disponible  */}
                <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 flex items-center gap-4">
                    <div className="flex text-xl h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                        <LuPackageOpen />
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Stock disponible</span>
                            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                                {medicamento.stockDisponible}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Cantidad a pedir */}
                <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 flex items-center gap-4">
                    <div className="flex text-xl h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                        <LuPackagePlus />
                    </div>
                    <div className="flex items-end justify-between">
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">Cantidad a pedir</span>
                            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                                {medicamento.stockDisponible - medicamento.stockRequerido}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>);
};

export default TarjetasInformacionMedicamento;