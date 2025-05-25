import Layout from '@/shared/components/Layout';
import GraficaComportamientoStock from '../../shared/components/GraficaComportamientoStock';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import SubirImagenProducto from './components/producto/SubirImagenProducto';
import { obtenerProducto } from './services/productoServices';
import SkeletonElement from '@/shared/components/SkeletonElement';
import { LuChevronRight } from 'react-icons/lu';
import { formatDate, obtenerEstadoVencimiento } from '@/utils/utilities';
import Movimientos from './components/movimientos/Movimientos';
import InformacionLote from './components/lotes/InformacionLote';
import { obtenerLote } from './services/loteServices';

const LotePagina = () => {
    const { loteId} = useParams();
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(false);
    const [producto, setProducto] = useState();
    const [estado, setEstado] = useState();
    const [lote, setLote] = useState(null);
    const [color, setColor] = useState();

    useEffect(() => {
        const fetchLoteYProducto = async () => {
            if (!loteId) return;
            setLoading(true); // Inicia la carga

            try {
                const resLote = await obtenerLote(token, loteId);
                setLote(resLote.data);

                const resProducto = await obtenerProducto(token, resLote.data.productoId);
                setProducto(resProducto.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Termina la carga
            }
        };
        fetchLoteYProducto();
    }, [loteId, token]);

    useEffect(() => {
        if(lote){
            const { estado, color } = obtenerEstadoVencimiento(lote?.fechaVencimiento);
            setEstado(estado);
            setColor(color);
        }
    }, [lote])

    return (
        <Layout>
            {/* Encabezado */}
            <div className='hidden'>
                {loading && (<div>
                    <SkeletonElement className={`max-w-[250px]`} />
                    <SkeletonElement className={`max-w-[500px] mt-3`} />
                </div>)}

                {!loading && producto && lote && (<div>
                    {/* Titulo */}
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900 flex gap-4 items-center my-4">
                        <SubirImagenProducto 
                            producto={producto}
                            setProducto={setProducto}
                            tipo = {producto?.tipo + "s"}
                        />
                        <Link to={`/${producto?.tipo === "medicamento" ? "medicamentos": "dispositivos"}/${producto?.id}`}>
                            <span> {producto?.nombre?.charAt(0).toUpperCase() + producto?.nombre?.slice(1)}</span>
                            <p className="text-sm font-normal text-gray-600 capitalize -mt-[3px]">{producto.tipo}</p>
                        </Link>
                        <LuChevronRight />
                        <p>{lote?.numeroLote}</p>
                    </h2>

                    <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-gray-900 mt-3">
                        {/* Registro sanitario */}
                        {lote?.registroSanitario && (
                            <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Registro sanitario</span>
                                <div className="mt-2 flex items-end gap-3">
                                    <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                       {lote?.registroSanitario}
                                    </h4>
                                </div>
                            </div>
                        )}
                        {/* Fecha de vencimiento */}
                        {lote?.fechaVencimiento && (
                            <div className="border-b border-gray-200 px-6 py-5 xl:border-r xl:border-b-0 dark:border-gray-800">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Fecha de vencimiento</span>
                                <div className="mt-2 flex items-end gap-3">
                                    <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                        {formatDate(lote?.fechaVencimiento)}
                                    </h4>
                                </div>
                            </div>
                        )}

                        {/* Estado */}
                        {estado && (
                            <div className="border-b border-gray-200 px-6 py-5 sm:border-r sm:border-b-0 dark:border-gray-800">
                                <div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Estado</span>
                                    <div className="mt-2 flex items-end gap-3">
                                        <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                            <p className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${color} text-right`}>{estado}</p>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stock requerido */}
                        {lote?.stockDisponible && (
                            <div className="px-6 py-5">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Stock disponible</span>
                                <div className="mt-2 flex items-end gap-3">
                                    <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                        {lote?.stockDisponible}
                                    </h4>
                                </div>
                            </div>
                        )}
                    </div>
                </div>)}
            </div>

            <div className="grid w-full md:grid-cols-12 gap-6 mt-4 ">
                <div className='col-span-12 xl:col-span-4 '>
                    <InformacionLote />
                </div>
                <div className="min-w-0 col-span-12 xl:col-span-8  grid xl:gap-4  items-start">
                    <Movimientos loteId={loteId} />
                </div>
            </div>
            <div className="mt-4">
                <GraficaComportamientoStock tipo="lote"/>
            </div>
        </Layout>
    );
};

export default LotePagina;