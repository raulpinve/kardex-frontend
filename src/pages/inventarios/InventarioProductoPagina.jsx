import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import TarjetasInformacionStockProducto from './components/productos/TarjetasInformacionStockProducto';
import InventarioLotes from './components/productos/InventarioLotes';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { obtenerCortePeriodo } from './services/cortesServices';
import InformacionProducto from '../productos/components/producto/InformacionProducto';
import Corte from './components/cortes/Corte';
import TituloInventarios from './components/TituloInventarios';
import Spinner from '@/shared/components/Spinner';

const InventarioProductoPagina = () => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(true);
    const [mensajeError, setMensajeError] = useState();
    const {periodo, productoId} = useParams();
    const [corte, setCorte] = useState();

    // Obtener información del corte
    useEffect(() => {
        const fetchCorte = async () => {
            setLoading(true)
            try {
                const res = await obtenerCortePeriodo(token, periodo, almacenId);
                setCorte(res.data);
            } catch (error){
                setMensajeError(error?.response?.data?.message || "Error al obtener el corte.");
            } finally {
                setLoading(false);
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
                    <TituloInventarios productoId={productoId} />
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
                <TarjetasInformacionStockProducto corteId={corte?.id} productoId={productoId}/> 
                <div className="grid w-full md:grid-cols-12 gap-6 mt-4 ">
                    <div className='col-span-12 xl:col-span-4 2xl:col-span-3'>
                        <InformacionProducto />
                    </div>
                    <div className="min-w-0 col-span-12 xl:col-span-8 2xl:col-span-9 grid xl:gap-4 2xl:gap-6 items-start">
                        <InventarioLotes corteId={corte?.id} />
                    </div>
                </div>

            </>)}
        </Layout>
    );
};

export default InventarioProductoPagina;