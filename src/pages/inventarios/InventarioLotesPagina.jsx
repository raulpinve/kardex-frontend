import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import InformacionLote from './components/lotes/InformacionLote';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { obtenerCortePeriodo } from './services/cortesServices';
import Movimientos from '../lotes/components/movimientos/Movimientos';
import Corte from './components/cortes/Corte';
import TarjetasInformacionStock from './components/lotes/TarjetasInformacionStock';
import TituloInventarios from './components/TituloInventarios';

const InventarioLotesPagina = () => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const {periodo, loteId} = useParams();
    const [ corte, setCorte ] = useState();
    const [error, setError] = useState(false);
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        const fetchCorte = async () => {
            try {
                const res = await obtenerCortePeriodo(token, periodo, almacenId);
                setCorte(res.data);
            } catch (error){
                setError(error?.response?.data?.message || "Error al obtener el corte.");
            }
        }
        if(!periodo || !almacenId) return;
        fetchCorte()    

    }, [periodo, token, almacenId])

    return (
        <Layout>
            <div className='py-2'>
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                    <TituloInventarios loteId={loteId}/>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-2">
                            <Corte />
                        </div>
                    </div>
                </div>
            </div>
    
            <TarjetasInformacionStock corteId={corte?.id} loteId={loteId}/> 
            <div className="grid w-full md:grid-cols-12 gap-6 items-start mt-4">
                <div className='col-span-12 xl:col-span-4 2xl:col-span-3'>
                    <InformacionLote />
                </div>
                <div className="min-w-0 col-span-12 xl:col-span-8 2xl:col-span-9 grid xl:gap-4 2xl:gap-6 items-start">
                    <Movimientos corteId={corte?.id} loteId={loteId}/>
                </div>
            </div>
        </Layout>
    );
};

export default InventarioLotesPagina;