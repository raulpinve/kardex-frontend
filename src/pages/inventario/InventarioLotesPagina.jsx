import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import { formatDateCorte } from '../../utils/utilities';
import CardTitulo from '../../shared/components/CardTitulo';
import { LuChevronRight, LuCircleCheck, LuEraser, LuPencil, LuRefreshCcw } from 'react-icons/lu';
import InformacionLote from './components/lotes/InformacionLote';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Pagination from '../../shared/components/Pagination';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { obtenerCorte, obtenerCorteLote } from './services/cortesServices';
import SkeletonTable from '../../shared/components/SkeletonTable';
import SkeletonElement from '../../shared/components/SkeletonElement';
import SeleccionarCorte from './components/cortes/SeleccionarCorte';
import { obtenerProducto } from './services/productoServices';
import Movimientos from './components/movimientos/Movimientos';

const InventarioLotesPagina = () => {
    const {corteId, loteId} = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [corteSeleccionado, setCorteSeleccionado] = useState();
    const [producto, setProducto] = useState();
    const [lote, setLote] = useState();
    const [errorLote, setErrorLote] = useState(null);
    const token = useSelector(state => state.auth.token);

    // Obtener información del lote en el corte 
    useEffect(() => {
        const fetchCorte = async () => {
            try {
                const res = await obtenerCorte(token, corteId);
                setCorteSeleccionado(res.data);
            } catch {
                setError("Error al obtener el corte.");
            }
        };
        
        const fetchLoteCorte = async () => {
            try {
                const res = await obtenerCorteLote(token, corteId, loteId);
                setProducto(res.data.producto);
                setLote(res.data);
            } catch (error) {
                setErrorLote(error.response.data.message || "Ha ocurrido un error interno al intentar obtener la información del lote en el corte.")
            }
        };
    
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
    
            await Promise.all([
                fetchCorte(),
                fetchLoteCorte()
            ]);
            setLoading(false);
        };

        if(corteId && loteId){
            fetchAll();
        }

        return () => {
            setLoading(false);
            setError(null);
            setErrorLote(null);
        }
    }, [corteId, loteId, token])

    return (
        <Layout>
            <div className='py-2'>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 h-[46px]">
                    <div className="flex items-center gap-2">
                        {/* Header */}
                        {!error && loading ? (
                            <SkeletonElement className="h-[30px] mt-3 max-w-[400px]" />
                        ): (
                            <div className="flex items-center justify-between gap-2 h-[46px]">
                                <div className="flex items-center gap-2">
                                    <SeleccionarCorte corteSeleccionado={corteSeleccionado} producto={producto} lote={lote}/>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="grid w-full md:grid-cols-12 gap-6 items-start mt-4">
                <InformacionLote lote={lote} loading = {loading} />
                <Movimientos />
            </div>
        </Layout>
    );
};

export default InventarioLotesPagina;