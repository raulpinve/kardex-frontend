import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import InformacionMedicamento from './components/medicamento/InformacionMedicamento';
import { useParams } from 'react-router-dom';
import Lotes from './components/lotes/Lotes';
import TarjetasInformacionMedicamento from './components/medicamento/TarjetasInformacionMedicamento';
import { obtenerMedicamento } from './services/medicamentosServices';
import { handleErrorsBasic } from '../../utils/handleErrors';
import { useSelector } from 'react-redux';

const MedicamentoPagina = () => {
    const {medicamentoId} = useParams();
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [medicamento, setMedicamento] = useState(null);
    const [error, setError] = useState(null);

    // Obtener información del medicamento 
    useEffect(() => {
        const fetchMedicamento = async() => {
            setLoading(true);
            setError(false);
            try {
                const res = await obtenerMedicamento(token, medicamentoId);
                setMedicamento(res.data);
            } catch (error) {

                handleErrorsBasic(error, setError);                
            } finally {
                setLoading(false);
            }
        }
        if(medicamentoId){
            fetchMedicamento();
        }
    },[medicamentoId])

    return (
        <Layout>
            <div className="grid w-full md:grid-cols-[320px_1fr] gap-4 items-start mt-4">
                <InformacionMedicamento 
                    medicamento={medicamento}
                    loading={loading}
                    error={error}
                />
                <div  className="min-w-0">
                    <TarjetasInformacionMedicamento
                        medicamento={medicamento}
                        loading={loading}
                        error={error}
                    />
                    <Lotes 
                        medicamentoId= {medicamentoId} 
                    />
                </div>
            </div>
        </Layout>
    );
};

export default MedicamentoPagina;