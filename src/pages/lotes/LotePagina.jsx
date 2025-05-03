import React from 'react';
import Layout from '../../shared/components/Layout';
import InformacionLote from './components/lote/InformacionLote';
import GraficaLote from './components/lote/GraficaLote';
import Movimientos from './components/movimientos/Movimientos';

const LotePagina = () => {
    return (
        <Layout>
            <div className="grid w-full md:grid-cols-12 gap-6 mt-4">
                <InformacionLote />
                <div className="col-span-8">
                    <GraficaLote />
                </div>
            </div>
            <div className="mt-6">
                <Movimientos />
            </div>
        </Layout>
    );
};

export default LotePagina;