import GraficaComportamientoStock from '../../shared/components/GraficaComportamientoStock';
import TituloProductos from '../productos/components/shared/TituloProductos';
import InformacionLote from './components/lote/InformacionLote';
import Movimientos from './components/movimientos/Movimientos';
import Layout from '../../shared/components/Layout';
import { useParams } from 'react-router-dom';
import React from 'react';

const LotePagina = () => {
    const { loteId} = useParams();
    return (
        <Layout>
            <TituloProductos loteId={loteId}/>
            <div className="grid w-full md:grid-cols-12 gap-4 mt-4">
                <div className='col-span-12 xl:col-span-4 2xl:col-span-3'>
                    <InformacionLote />
                </div>
                <div className="min-w-0 col-span-12 xl:col-span-8 2xl:col-span-9 xl:gap-4">
                    <Movimientos loteId={loteId} />
                </div>
            </div>
            <div className="mt-6">
                <GraficaComportamientoStock tipo="lote"/>
            </div>
        </Layout>
    );
};

export default LotePagina;