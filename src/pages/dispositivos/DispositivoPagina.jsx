import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import { useParams } from 'react-router-dom';
// import Lotes from './components/lotes/Lotes';
// import TarjetasInformacionMedicamento from './components/medicamento/TarjetasInformacionMedicamento';
import { handleErrorsBasic } from '../../utils/handleErrors';
import { useSelector } from 'react-redux';
import { obtenerDispositivo } from './services/dispositivosServices';
import InformacionDispositivo from './components/dispositivo/InformacionDispositivo';
import TarjetasInformacionDispositivo from './components/dispositivo/TarjetasInformacionDispositivo';
import Lotes from './components/lotes/Lotes';

const DispositivoPagina = () => {
    const {dispositivoId} = useParams();
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [dispositivo, setDispositivo] = useState(null);
    const [error, setError] = useState(null);

    // Obtener información del dispositivo 
    useEffect(() => {
        const fetchDispositivo = async() => {
            setLoading(true);
            setError(false);
            try {
                const res = await obtenerDispositivo(token , dispositivoId);
                setDispositivo(res.data);
            } catch (error) {
                handleErrorsBasic(error, setError);                
            } finally {
                setLoading(false);
            }
        }
        if(dispositivoId){
            fetchDispositivo();
        }
    },[dispositivoId])

    return (
        <Layout>
            <div className="grid w-full md:grid-cols-[320px_1fr] gap-4 items-start mt-4">
                <InformacionDispositivo 
                    dispositivo={dispositivo}
                    loading={loading}
                    error={error}
                />
                <div className="min-w-0">
                    <TarjetasInformacionDispositivo
                        dispositivo={dispositivo}
                        loading={loading}
                        error={error}
                    />
                    <Lotes dispositivoId= {dispositivoId} />
                </div>
            </div>
        </Layout>
    );
};

export default DispositivoPagina;