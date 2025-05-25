import { useParams } from 'react-router-dom';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import { formatDate, obtenerEstadoVencimiento } from '../../../../utils/utilities';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MessageError from '@/shared/components/MessageError';

const InformacionLote = () => {
    const {loteId} = useParams();
    const token = useSelector(state => state.auth.token);
    const [lote, setLote] = useState();
    const [estado, setEstado] = useState("");
    const [color, setColor] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchLote = async () => {
            setLoading(true)
            try {
                const res = await obtenerLote(token, loteId);
                setLote(res.data);
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error al intentar obtener la información del lote.")
            } finally{
                setLoading(false);
            }
        }
        if(!loteId) return;
        fetchLote();
    }, [loteId, token])
    
    useEffect(() => {
        if(lote){
            const { estado, color } = obtenerEstadoVencimiento(lote?.fechaVencimiento);
            setEstado(estado);
            setColor(color);
        }
    }, [lote])

    return (
        <Card className={`text-sm text-gray-700 dark:text-gray-400 col-span-12 xl:col-span-4 h-full`}>
            {/* Loading */}
            {loading && (<div>
                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[36px] mb-3 mt-3"></div>
                <div className='mt-6'>
                    {[...Array(5)].map((_,index) => <div key={index} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[45px] mb-3"></div>)}
                </div>
            </div>)}
            {!loading && error && <p className='text-center my-8'>{error}</p>}
            {!loading && lote && ( <>
                <div className='flex items-center mt-2 justify-between h-[40px]'>
                    <CardTitulo className="w-full flex justify-between">
                        <span>Lote</span>
                        <span>{lote?.numeroLote}</span>
                    </CardTitulo>
                </div>
                <div className='my-5'>
                    {/* Registro sanitario */}
                    <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                        <span className="text-theme-sm">
                            Producto
                        </span>
                        <span className="text-right text-theme-sm">
                            {lote?.productoNombre}
                        </span>
                    </div>

                    {/* Registro sanitario */}
                    <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                        <span className="text-theme-sm">
                            Registro sanitario
                        </span>
                        <span className="text-right text-theme-sm">
                            {lote?.registroSanitario}
                        </span>
                    </div>

                    {/* Fecha de vencimiento */}
                    {lote?.fechaVencimiento && (
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Fecha de vencimiento
                            </span>
                            <span className="text-right text-theme-sm">
                                {formatDate(lote?.fechaVencimiento)}
                            </span>
                        </div>
                    )}

                    {/* Estado */}
                    <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                        <p className="text-theme-sm">
                            Estado
                        </p>
                        {estado && color && (
                            <p className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color} text-right`}>{estado}</p>
                        )}
                    </div>

                    {/* Stock inicial */}
                    {lote?.stockInicial && (
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Stock inicial
                            </span>
                            <span className="text-right text-theme-sm">
                                {lote.stockInicial}
                            </span>
                        </div>
                    )}
                </div>
            </>)}
        </Card>
    );
};

export default InformacionLote;