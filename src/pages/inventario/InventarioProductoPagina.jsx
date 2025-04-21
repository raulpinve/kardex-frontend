import React from 'react';
import Layout from '../../shared/components/Layout';
import InformacionProducto from './components/productos/InformacionProducto';
import { formatDateCorte } from '../../utils/utilities';
import CardTitulo from '../../shared/components/CardTitulo';
import { LuChevronRight, LuCircleAlert, LuCircleCheck } from 'react-icons/lu';
import TarjetasInformacionStock from './components/productos/TarjetasInformacionStock';
import InventarioLotes from './components/productos/InventarioLotes';
import InventarioMovimientos from './components/productos/InventarioMovimientos';

const InventarioProductoPagina = ({corteSeleccionado}) => {
    return (
        <Layout>
            <div className='py-2'>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 h-[46px]">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            <CardTitulo className={`flex items-center`}>Inventarios <LuChevronRight /> 
                                {corteSeleccionado?.mes && (
                                    <span 
                                        className="text-blue-600 cursor-pointer ml-1"
                                        // onClick={() => {setModalActivo("seleccionar-corte")}}
                                    >{formatDateCorte(corteSeleccionado?.mes)}</span>
                                )}
                                <span className="text-blue-600 cursor-pointer ml-1">junio de 2024</span>
                                {/* Badge activo */}
                                <span className="flex ml-1 items-center gap-1 rounded-full bg-green-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
                                    <LuCircleCheck /> Corte activo
                                </span>
                                <LuChevronRight /> 
                                <span className=" ml-1">Adrenalina</span>
                            </CardTitulo>
                            {/* <span className="ml-2 text-gray-500 font-semibold text-md"></span> */}
                        </div>
                        {/* Badge cerrado */}
                        <span className="flex items-center hidden gap-1 rounded-full bg-red-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-red-600 dark:bg-red-500/15 dark:text-red-500">
                            <LuCircleAlert /> Cerrado
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid w-full md:grid-cols-12 gap-6 items-start  mt-4">
                <InformacionProducto />
                <div className="min-w-0 col-span-12 xl:col-span-9 grid gap-6">
                    <TarjetasInformacionStock /> 
                    <InventarioLotes />
                    <InventarioMovimientos />
                </div>
            </div>
        </Layout>
    );
};

export default InventarioProductoPagina;