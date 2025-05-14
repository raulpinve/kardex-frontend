import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import InformacionLote from './components/lotes/InformacionLote';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { obtenerCorte, obtenerCorteLote, obtenerCortePeriodo } from './services/cortesServices';
import SkeletonElement from '../../shared/components/SkeletonElement';
import SeleccionarCorte from './components/cortes/SeleccionarCorte';
import Movimientos from '../lotes/components/movimientos/Movimientos';
import CardTitulo from '@/shared/components/CardTitulo';
import Corte from './components/cortes/Corte';
import TarjetasInformacionStock from './components/lotes/TarjetasInformacionStock';

const InventarioLotesPagina = () => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const {periodo, loteId} = useParams();
    const [loading, setLoading] = useState(false);
    const [ corte, setCorte ] = useState();
    const [error, setError] = useState(false);
    const [corteSeleccionado, setCorteSeleccionado] = useState();
    const [producto, setProducto] = useState();
    const [lote, setLote] = useState();
    const [errorLote, setErrorLote] = useState(null);
    const token = useSelector(state => state.auth.token);

    // Obtener información del corte
    useEffect(() => {
        const fetchCorte = async () => {
            try {
                const res = await obtenerCortePeriodo(token, periodo, almacenId);
                setCorte(res.data);
            } catch (error){
                console.log(error)
                setError(error?.response?.data?.message || "Error al obtener el corte.");
            }
        }
        if(!periodo || !almacenId) return;
        fetchCorte()    

    }, [periodo, token, almacenId])

    // // Obtener información del lote en el corte 
    // useEffect(() => {
    //     const fetchCorte = async () => {
    //         try {
    //             const res = await obtenerCorte(token, corteId);
    //             setCorteSeleccionado(res.data);
    //         } catch {
    //             setError("Error al obtener el corte.");
    //         }
    //     };
        
    //     const fetchLoteCorte = async () => {
    //         try {
    //             const res = await obtenerCorteLote(token, corteId, loteId);
    //             setProducto(res.data.producto);
    //             setLote(res.data);
    //         } catch (error) {
    //             setErrorLote(error.response.data.message || "Ha ocurrido un error interno al intentar obtener la información del lote en el corte.")
    //         }
    //     };
    
    //     const fetchAll = async () => {
    //         setLoading(true);
    //         setError(null);
    
    //         await Promise.all([
    //             fetchCorte(),
    //             fetchLoteCorte()
    //         ]);
    //         setLoading(false);
    //     };

    //     if(corteId && loteId){
    //         fetchAll();
    //     }

    //     return () => {
    //         setLoading(false);
    //         setError(null);
    //         setErrorLote(null);
    //     }
    // }, [corteId, loteId, token])

    return (
        <Layout>
            <div className='py-2'>
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                    <div className="">
                        <CardTitulo className="flex items-center">
                            Inventarios 
                        </CardTitulo>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-2">
                            <Corte />
                        </div>
                    </div>
                </div>
            </div>
            <TarjetasInformacionStock corteId={corte?.id} loteId={loteId}/> 
            <div className="grid w-full md:grid-cols-12 gap-6 items-start mt-4">
                <InformacionLote lote={lote} loading = {loading} error = {error} />
                <Movimientos />
            </div>
        </Layout>
    );
};

export default InventarioLotesPagina;