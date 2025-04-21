import React from 'react';
import { LuCircleAlert, LuListStart, LuPackageCheck, LuPackageOpen } from 'react-icons/lu';

const TarjetasInformacionStock = () => {
    return (
        <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>

            {/* Stock requerido */}
            <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 flex items-center gap-4">
                <div className="flex text-xl h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                    <LuPackageCheck />
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Stock requerido</span>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                            80
                        </h4>
                    </div>
                </div>
            </div>

            {/* Stock Inicial */}
            <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 flex items-center gap-4">
                <div className="flex text-xl h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                    <LuListStart />
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Stock inicial</span>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                            312
                        </h4>
                    </div>
                </div>
            </div>

            {/* Stock disponible */}
            <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 flex items-center gap-4">
                <div className="flex text-xl h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                    <LuPackageOpen />
                </div>
                <div className="flex items-end justify-between">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Stock disponible</span>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                            312
                        </h4>
                    </div>
                </div>
            </div>

            {/* Cantidad a pedir */}
            <div className="rounded-2xl relative border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 flex items-center gap-4">
                <div className="flex text-xl h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-gray-200">
                    <LuPackageOpen />
                </div>
                <div className="flex items-end justify-between">
                    <div >
                        <span className="text-sm text-gray-500 dark:text-gray-400 md:hidden">Pedidos</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">Cantidad a pedir</span>
                        <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                            0
                        </h4>
                    </div>
                </div>
                <div>
                    <span className="flex hidden items-center gap-1 rounded-full bg-red-50 py-0.5 pl-2 pr-2.5 text-xs font-medium text-red-600 dark:bg-red-500/15 dark:text-red-500">
                        <LuCircleAlert /> Stock bajo
                    </span>
                    <span className="absolute right-3 bottom-3 gap-1 rounded-full bg-green-50 py-0.5 pl-2 pr-2.5 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
                        + 40 unidades
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TarjetasInformacionStock;