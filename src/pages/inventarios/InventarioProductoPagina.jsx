import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
// import InformacionProducto from './components/productos/InformacionProducto';
import TarjetasInformacionStock from './components/productos/TarjetasInformacionStock';
import InventarioLotes from './components/productos/InventarioLotes';
import { useParams } from 'react-router-dom';
import { obtenerProducto, obtenerProductoCorte } from './services/productoServices';
import { useSelector } from 'react-redux';
import SkeletonElement from '../../shared/components/SkeletonElement';
import SeleccionarCorte from './components/cortes/SeleccionarCorte';
import { obtenerCorte } from './services/cortesServices';
import InformacionProducto from '../productos/components/producto/InformacionProducto';

const InventarioProductoPagina = () => {
    const {corteId, productoId} = useParams();
    const [error, setError] = useState();
    const [errorStock, setErrorStock] = useState();
    const [loading, setLoading] = useState(true);
    const [producto, setProducto] = useState();
    const [stock, setStock] = useState();
    const [corteSeleccionado, setCorteSeleccionado] = useState();
    const token = useSelector(state => state.auth.token);

    // Obtener información del producto en el corte 
    useEffect(() => {
        const fetchCorte = async () => {
            try {
                const res = await obtenerCorte(token, corteId);
                setCorteSeleccionado(res.data);
            } catch {
                setError("Error al obtener el corte.");
            }
        };
    
        const fetchProducto = async () => {
            try {
                const res = await obtenerProducto(token, productoId);
                setProducto(res.data);
            } catch {
                setError("Error al obtener producto.");
            }
        };
    
        const fetchProductoCorte = async () => {
            try {
                const res = await obtenerProductoCorte(token, corteId, productoId);
                setStock(res.data);
            } catch (error) {
                setErrorStock(error.response.data.message || "Ha ocurrido un error interno al intentar obtener la información del stock.")
            }
        };
    
        const fetchAll = async () => {
            setLoading(true);
            setError(null);
    
            await Promise.all([
                fetchCorte(),
                fetchProducto(),
                fetchProductoCorte()
            ]);
            setLoading(false);
        };

        if(corteId && productoId){
            fetchAll();
        }

        return () => {
            setLoading(false);
            setError(null);
            setErrorStock(null);
            setProducto(null);
            setCorteSeleccionado(null);
            setStock(null);
        }
    }, [corteId, productoId, token])
    return (
        <Layout>
            <div className='py-2'>
                {/* Header */}
                {!error && loading ? (
                    <SkeletonElement className="h-[30px] mt-3 max-w-[400px]" />
                ): (
                    <div className="flex items-center justify-between gap-2 h-[46px]">
                        <div className="flex items-center gap-2">
                            <SeleccionarCorte corteSeleccionado={corteSeleccionado} producto={producto}/>
                        </div>
                    </div>
                )}
            </div>
            <TarjetasInformacionStock
                stock = {stock}
                loading = {loading}
                error = {errorStock}
            /> 
           
            <div className="grid w-full md:grid-cols-12 gap-6 mt-4 items-start">
                <InformacionProducto 
                    producto= {producto} 
                    loading = {loading}
                    error = {error}    
                />
                <div className="min-w-0 col-span-12 xl:col-span-8 2xl:col-span-8 grid xl:gap-4 2xl:gap-6">
                    {/* {!errorStock && corteSeleccionado && producto && ( */}
                    <div className='grid'>
                        <InventarioLotes corteSeleccionado={corteSeleccionado} producto = {producto} />
                        {/* <InventarioMovimientos /> */}
                    </div>
                    {/* )} */}
                </div>
            </div>
        </Layout>
    );
};

export default InventarioProductoPagina;