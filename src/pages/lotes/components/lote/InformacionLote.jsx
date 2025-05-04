import React, { useEffect, useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import { useParams } from 'react-router-dom';
import { obtenerLote } from '../../services/loteServices';
import { useSelector } from 'react-redux';
import { dateColombiaFormat, obtenerEstadoVencimiento } from '../../../../utils/utilities';
import SkeletonElement from '../../../../shared/components/SkeletonElement';
import MessageError from '../../../../shared/components/MessageError';

const InformacionLote = () => {
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(true);
    const [lote, setLote] = useState(null);
    const [error, setError] = useState(null);
    const {loteId} = useParams();

    // Obtener información lote
    useEffect(() => {
        const fecthInformacionLote = async() => {
            try {
                setLoading(true);
                const respuesta = await obtenerLote(token, loteId);
                setLote(respuesta.data);
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno. Por favor, inténtalo nuevamente.");               
            }finally{
                setLoading(false);
            }
        }
        if(loteId){
            fecthInformacionLote();
        }
    }, [token, loteId]);

    const { estado, color } = obtenerEstadoVencimiento(lote?.fechaVencimiento);

    return (
        <Card className={`text-sm text-gray-700 dark:text-gray-400 col-span-12 xl:col-span-4 `}>
            <div className='my-5'>
                {!loading && !lote && error && (<>
                    <MessageError>
                        {error}
                    </MessageError>
                </>)}
                {loading && (<>
                    <div className='grid grid-cols-2 gap-4'>
                        <SkeletonElement className="h-[35px]"/>
                        <SkeletonElement className="h-[35px]"/>
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-4'>
                        <SkeletonElement />
                        <SkeletonElement />
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-4'>
                        <SkeletonElement />
                        <SkeletonElement />
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-4'>
                        <SkeletonElement />
                        <SkeletonElement />
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-4'>
                        <SkeletonElement />
                        <SkeletonElement />
                    </div>
                    <div className='grid grid-cols-2 gap-4 mt-4'>
                        <SkeletonElement />
                        <SkeletonElement />
                    </div>
                </>)}
                {!loading && lote && (<>
                    <CardTitulo className="flex justify-between">
                        <span>Lote</span>
                        <span>{lote?.numeroLote}</span>
                    </CardTitulo>

                    {/* Producto */}
                    <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                        <span className="text-theme-sm">
                            Producto
                        </span>
                        <span className="text-right text-theme-sm capitalize">
                            {lote?.producto}
                        </span>
                    </div>

                    {/* Registro sanitario */}
                    <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                        <span className="text-theme-sm">
                            Registro sanitario
                        </span>
                        <span className="text-right text-theme-sm capitalize">
                            {lote?.registroSanitario}
                        </span>
                    </div>

                    {/* Fecha de vencimiento */}
                    <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                        <span className="text-theme-sm">
                            Fecha de vencimiento
                        </span>
                        {lote?.fechaVencimiento && (<div className='flex gap-2 items-center'>
                            <p className="text-gray-700 dark:text-gray-400">{dateColombiaFormat(lote?.fechaVencimiento)}</p>
                            <p className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${color}`}>
                                {estado}
                            </p>
                        </div>)}
                    </div>

                    {/* Stock disponible */}
                    <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                        <span className="text-theme-sm">
                            StockDisponible
                        </span>
                        <span className="text-right text-theme-sm capitalize">
                        {lote?.stockDisponible}
                        </span>
                    </div>
                </>)}
                
        </div>
    </Card>);
};

export default InformacionLote;