import React from 'react';
import Layout from '../../shared/components/Layout';
import InformacionMedicamento from './components/medicamento/InformacionMedicamento';
import { useParams } from 'react-router-dom';
import Lotes from './components/lotes/Lotes';
import { LuBox, LuShoppingBag, LuTarget } from 'react-icons/lu';

const MedicamentoPagina = () => {
    const {medicamentoId} = useParams();
    return (
        <Layout>
            <div className="grid grid-cols-[320px_1fr] gap-4 items-start mt-4">
                <InformacionMedicamento medicamentoId={medicamentoId} />
                <div>
                    <div className='grid gap-4 mb-4'>
                        <div className='grid grid-cols-3 gap-4'>
                           
                            {/* Stock requerido */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5">
                                <div className="flex text-xl h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                    <LuBox />
                                </div>
                                <div className="mt-3 flex items-end justify-between">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Stock requerido</span>
                                        <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
                                            3,782
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            {/* Stock disponible  */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5">
                                <div className="flex text-xl h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                    <LuTarget />
                                </div>
                                <div className="mt-3 flex items-end justify-between">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Stock disponible</span>
                                        <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
                                            3,782
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            {/* Cantidad a pedir */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-white/[0.03] md:p-5">
                                <div className="flex text-xl h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                                    <LuShoppingBag />
                                </div>
                                <div className="mt-3 flex items-end justify-between">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Cantidad a pedir</span>
                                        <h4 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90">
                                            3,782
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Lotes medicamentoId= {medicamentoId} />
                </div>
            </div>
        </Layout>
    );
};

export default MedicamentoPagina;