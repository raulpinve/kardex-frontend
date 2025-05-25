import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import TarjetasInformacionStockProducto from './components/productos/TarjetasInformacionStockProducto';
import InventarioLotes from './components/productos/InventarioLotes';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { obtenerCortePeriodo } from './services/cortesServices';
import Spinner from '@/shared/components/Spinner';
import { formatDateCorte } from '@/utils/utilities';
import { obtenerProducto } from './services/productoServices';
import SkeletonElement from '@/shared/components/SkeletonElement';
import SubirImagenProducto from '../productos/components/producto/SubirImagenProducto';
import TituloInventarios from './components/TituloInventarios';

const InventarioProductoPagina = () => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(true);
    const [mensajeError, setMensajeError] = useState();
    const {periodo, productoId} = useParams();
    const [corte, setCorte] = useState();
    const [producto, setProducto] = useState();

    // Obtener información del corte
    useEffect(() => {
        const fetchCorte = async () => {
            setLoading(true)
            try {
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
                setLoading(false);
            }
        }

        if(!periodo || !almacenId) return;
        fetchCorte()    
    }, [periodo, token, almacenId])

    // Obtener la información del producto
    useEffect(() => {
        const fecthProducto = async () => {
            try {
                setLoading(true);
                const res = await obtenerProducto(token, productoId);
                setProducto(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if(!productoId) return;
        fecthProducto()
    }, [productoId, token])

    return (
        <Layout>
            <TituloInventarios />
            <div>
                {loading && (<div>
                    <SkeletonElement className={`max-w-[250px]`} />
                    <SkeletonElement className={`max-w-[500px] mt-3`} />
                </div>)}
                {!loading && producto && (<div className=' my-8'>
                    {/* Titulo */}
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 flex gap-4 items-center">
                        <SubirImagenProducto 
                            producto={producto}
                            setProducto={setProducto}
                            tipo = {producto?.tipo + "s"}
                        />
                        <div>
                            <span> {producto?.nombre?.charAt(0).toUpperCase() + producto?.nombre?.slice(1)}</span>
                            <p className="text-sm font-normal text-gray-600 capitalize -mt-[3px]">{producto.tipo}</p>
                        </div>
                    </h1>
                    <p className="text-sm text-gray-700 dark:text-gray-300 my-4 hidden">
                        {producto?.formaFarmaceutica && <span><b>Forma farmacéutica:</b> {producto.formaFarmaceutica}</span>}
                        {producto?.presentacionComercial && <span> • <b>Presentación:</b> {producto.presentacionComercial}</span>}
                        {producto?.concentracion && <span> • <b>Concentración:</b> {producto.concentracion}</span>}
                        {producto?.unidadMedida && <span> • <b>Unidad:</b> {producto.unidadMedida}</span>}
                        {producto?.serie && <span> • <b>Serie:</b> {producto.serie}</span>}
                        {producto?.riesgo && <span> • <b>Riesgo:</b> {producto.riesgo}</span>}
                    </p>
                </div>)}
            </div>

            {loading && (<Spinner />)}
            {!loading && mensajeError && (
                <p className="rounded mt-4 text-center text-gray-600 dark:text-gray-200">
                    {mensajeError}
               </p>
            )}
            {!mensajeError && !loading && corte && (<>
                <TarjetasInformacionStockProducto corteId={corte?.id} productoId={productoId}/> 
                <div className="mt-4">
                    <InventarioLotes corteId={corte?.id} />
                </div>
            </>)}
        </Layout>
    );
};

export default InventarioProductoPagina;