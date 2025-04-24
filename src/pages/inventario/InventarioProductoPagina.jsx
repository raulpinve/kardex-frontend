import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import InformacionProducto from './components/productos/InformacionProducto';
import { formatDateCorte } from '../../utils/utilities';
import CardTitulo from '../../shared/components/CardTitulo';
import { LuChevronRight, LuCircleAlert, LuCircleCheck } from 'react-icons/lu';
import TarjetasInformacionStock from './components/productos/TarjetasInformacionStock';
import InventarioLotes from './components/productos/InventarioLotes';
import InventarioMovimientos from './components/productos/InventarioMovimientos';
import { useParams } from 'react-router-dom';
import { obtenerProductoCorte } from './services/productoServices';
import { useSelector } from 'react-redux';
import Badge from '../../shared/components/Badge';
import SkeletonElement from '../../shared/components/SkeletonElement';

const InventarioProductoPagina = () => {
    const {corteId, productoId} = useParams();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(null);
    const [producto, setProducto] = useState();
    const [corteSeleccionado, setCorteSeleccionado] = useState();
    const token = useSelector(state => state.auth.token);

    // Obtener información del producto en el corte 
    useEffect(() => {
        const fetchProductoCorte = async() => {
            setLoading(true);
            try {
                const res = await obtenerProductoCorte(token, corteId, productoId)
                if(res?.data){
                    setProducto(res.data.producto);
                    setCorteSeleccionado(res.data.corte);
                }
            } catch (error) {
                setError();
            } finally {
                setLoading(false);
            }
        }
        if(corteId && productoId){
            fetchProductoCorte();
        }
    }, [corteId, productoId, token])

    return (
        <Layout>
            <div className='py-2'>
                {/* Header */}
                {loading ? (
                    <SkeletonElement className="h-[30px] mt-3 max-w-[400px]" />
                ): (
                    <div className="flex items-center justify-between gap-2 h-[46px]">
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                <CardTitulo className={`flex items-center`}>Inventarios 
                                    {corteSeleccionado?.mes && (<>
                                        <LuChevronRight /> 
                                        <span 
                                            className="text-blue-600 cursor-pointer ml-1"
                                        >
                                            {formatDateCorte(corteSeleccionado?.mes)}
                                        </span>
                                        {corteSeleccionado?.cerrado ? 
                                            <Badge tipo="danger"> Cerrado</Badge>:
                                            <Badge> Activo </Badge>                                    
                                        }
                                    </>)}
                                    <LuChevronRight /> 
                                    <span className="ml-1">{producto?.nombre}</span>
                                </CardTitulo>
                            </div>
                            {/* Badge cerrado */}
                            <span className="flex items-center hidden gap-1 rounded-full bg-red-50 py-0.5 pl-2 pr-2.5 text-sm font-medium text-red-600 dark:bg-red-500/15 dark:text-red-500">
                                <LuCircleAlert /> Cerrado
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid w-full md:grid-cols-12 gap-6  mt-4">
                <InformacionProducto 
                    producto= {producto} 
                    loading = {loading}
                    error = {error}    
                />
                <div className="min-w-0 col-span-12 xl:col-span-8 2xl:col-span-8 grid gap-6">
                    <TarjetasInformacionStock /> 
                </div>
            </div>
            <div className='grid gap-6 mt-6'>
                <InventarioLotes />
                <InventarioMovimientos />
            </div>
        </Layout>
    );
};

export default InventarioProductoPagina;