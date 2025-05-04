import GraficaComportamientoStock from '../../shared/components/GraficaComportamientoStock';
import InformacionLote from './components/lote/InformacionLote';
import Movimientos from './components/movimientos/Movimientos';
import Layout from '../../shared/components/Layout';
import React from 'react';

const LotePagina = () => {
    return (
        <Layout>
            <div className="grid w-full md:grid-cols-12 gap-6 mt-4">
                <InformacionLote />
                <div className="col-span-8">
                    <GraficaComportamientoStock tipo="lote"/>
                </div>
            </div>
            <div className="mt-6">
                <Movimientos />
            </div>
        </Layout>
    );
};

export default LotePagina;