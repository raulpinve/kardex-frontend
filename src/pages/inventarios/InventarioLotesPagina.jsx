import TarjetasInformacionStock from './components/lotes/TarjetasInformacionStock';
import Movimientos from '../lotes/components/movimientos/Movimientos';
import InformacionLote from './components/lotes/InformacionLote';
import { obtenerCortePeriodo } from './services/cortesServices';
import TituloInventarios from './components/TituloInventarios';
import Layout from '../../shared/components/Layout';
import React, { useEffect, useState } from 'react';
import Corte from './components/cortes/Corte';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '@/shared/components/Spinner';

const InventarioLotesPagina = () => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const token = useSelector(state => state.auth.token);
    const [mensajeError, setMensajeError] = useState();
    const [loading, setLoading] = useState(true);
    const [ corte, setCorte ] = useState();
    const {periodo, loteId} = useParams();


    useEffect(() => {
        const fetchCorte = async () => {
            try {
                setLoading(true);
                const res = await obtenerCortePeriodo(token, periodo, almacenId);
                setCorte(res.data);
            } catch (error){
                setMensajeError(error?.response?.data?.message || "Error al obtener el corte.");
            } finally {
                setLoading(false)
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
            {loading && (<Spinner />)}
            {!loading && mensajeError && (
                <p className="rounded mt-4 text-center text-gray-600 dark:text-gray-200">
                    {mensajeError}
               </p>
            )}
            {!mensajeError && !loading && corte && (<>
                <TarjetasInformacionStock corteId={corte?.id} loteId={loteId}/> 
                <div className="grid w-full md:grid-cols-12 gap-6 items-start mt-4">
                    <div className='col-span-12 xl:col-span-4 2xl:col-span-3'>
                        <InformacionLote />
                    </div>
                    <div className="min-w-0 col-span-12 xl:col-span-8 2xl:col-span-9 grid xl:gap-4 2xl:gap-6 items-start">
                        <Movimientos corteId={corte?.id} loteId={loteId}/>
                    </div>
                </div>
            </>)}
        </Layout>
    );
};

export default InventarioLotesPagina;