import React from 'react';
import Layout from '../../shared/components/Layout';
import InformacionMedicamento from './components/medicamento/InformacionMedicamento';
import { useParams } from 'react-router-dom';

const MedicamentoPagina = () => {
    const {medicamentoId} = useParams();

    return (
        <Layout>
            <InformacionMedicamento medicamentoId={medicamentoId} />
        </Layout>
    );
};

export default MedicamentoPagina;