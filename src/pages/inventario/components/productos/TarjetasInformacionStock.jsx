import React from 'react';
import { LuListStart, LuPackageCheck, LuPackageOpen, LuPackagePlus } from 'react-icons/lu';

const TarjetasInformacionStock = () => {
    return (
        <div className='grid grid-cols-2 gap-4'>
            {/* Stock requerido */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-xl">
                    <LuPackageCheck />
                </div>
                <div className="mt-5 flex items-end justify-between">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Stock requerido</span>
                        <h4 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
                            3,782
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
                            3,782
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
                            3,782
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
                            3,782
                        </h4>
                    </div>
                    <span className="absolute right-2 bottom-2 gap-1 rounded-full bg-green-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
                        + 40 unidades
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TarjetasInformacionStock;