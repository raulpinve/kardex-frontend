import TarjetasInformacionStock from './components/lotes/TarjetasInformacionStock';
import Layout from '../../shared/components/Layout';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '@/shared/components/Spinner';
import { formatDateCorte } from '@/utils/utilities';
import Movimientos from '../productos/components/movimientos/Movimientos';
import { obtenerCortePeriodo } from './services/cortesServices';
import TituloInventarios from './components/TituloInventarios';
import GraficaComportamientoStock from '@/shared/components/GraficaComportamientoStock';

const InventarioLotesPagina = () => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const token = useSelector(state => state.auth.token);
    const [refreshStock, setRefreshStock] = useState(0);
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
                let mensaje;

                if(error.status === 404){
                    mensaje = `No hay un corte registrado para el período de ${formatDateCorte(periodo)}`;
                }else if(error?.response?.data?.message){
                    mensaje = error?.response?.data?.message;
                }else{
                    mensaje = "Error al obtener corte.";
                }
                setMensajeError(mensaje);
            } finally {
                setLoading(false)
            }
        }
        if(!periodo || !almacenId) return;
        fetchCorte()    

    }, [periodo, token, almacenId])

    return (
        <Layout>
            <TituloInventarios loteId={loteId} />

            {loading && (<Spinner />)}
            {!loading && mensajeError && (
                <p className="rounded mt-4 text-center text-gray-600 dark:text-gray-200">
                    {mensajeError}
               </p>
            )}
            {!mensajeError && !loading && corte && (<div className='mt-8'>
                <TarjetasInformacionStock corteId={corte?.id} loteId={loteId} refreshStock={refreshStock}/> 
                <div className="mt-4 grid gap-4">
                    <GraficaComportamientoStock tipo={`lote`} corteId={corte?.id}/>
                    <Movimientos corteId={corte?.id} loteId={loteId} setRefreshStock={setRefreshStock}/>
                </div>
            </div>)}
        </Layout>
    );
};

export default InventarioLotesPagina;