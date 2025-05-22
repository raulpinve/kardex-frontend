import React from 'react';
import Layout from '../../shared/components/Layout';
import { useParams } from 'react-router-dom';
import TarjetasInformacionStock from './components/producto/TarjetasInformacionStock';
import InformacionProducto from './components/producto/InformacionProducto';
import Lotes from './components/lotes/Lotes';
import GraficaComportamientoStock from '../../shared/components/GraficaComportamientoStock';
import TituloProductos from './components/shared/TituloProductos';

const ProductoPagina = ({ tipo }) => {
    const {productoId} = useParams();
    return (
        <Layout>
            <TituloProductos productoId={productoId}/>
            <TarjetasInformacionStock productoId={productoId}/>
            <div className="grid w-full md:grid-cols-12 gap-4 mt-4 min-w-0">
                <div className='col-span-12 xl:col-span-4 2xl:col-span-3'>
                    <InformacionProducto />
                </div>
                <div className="min-w-0 col-span-12 xl:col-span-8 2xl:col-span-9 xl:gap-4 2xl:gap-6">
                    <Lotes tipo={tipo} productoId={productoId} />
                </div>
            </div>
            <div className='mt-6'>
                <GraficaComportamientoStock />
            </div>
        </Layout>
    );
};

export default ProductoPagina;