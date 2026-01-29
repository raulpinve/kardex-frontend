import React, { useEffect, useState } from 'react';
import TarjetasInformacionStockProducto from './components/productos/TarjetasInformacionStockProducto';
import { useParams } from 'react-router-dom';
import Spinner from '@/shared/components/Spinner';
import SkeletonElement from '@/shared/components/SkeletonElement';
import SubirImagenProducto from '../productos/components/producto/SubirImagenProducto';
import ModalMostrarCodigoBarras from '../productos/components/productos/ModalMostrarCodigoBarras';
import { LuBarcode } from 'react-icons/lu';
import { obtenerCorte } from './services/cortesServices';
import { obtenerProducto } from './services/productosServices';
import ListadoLotesCorte from './components/lotes/ListadoLotesCorte';
import ListadoMovimientosProductosCorte from './components/movimientos/ListadoMovimientosProductosCorte';
import GraficaProductosCorte from './components/productos/GraficaProductosCorte';

const CortesProductoPagina = () => {
    const [mensajeError, setMensajeError] = useState();
    const [loading, setLoading] = useState(true);
    const [producto, setProducto] = useState();
    const [corte, setCorte] = useState();
    const {corteId, productoId, tipo} = useParams();
    const [modalActivo, setModalActivo] = useState("");

    // Obtener información del producto en el corte
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const resCorte = await obtenerCorte(corteId);
                setCorte(resCorte.data);

                const resProducto = await obtenerProducto(tipo, productoId);
                setProducto(resProducto.data);
            } catch (error) {
                setMensajeError(error, setMensajeError)
            } finally {
                setLoading(false);
            }
          
        };

        if (!productoId) return;
        fetchData();

    }, [corteId, productoId, tipo]);

    return (
        <>
            <div>
                {loading && (<div>
                    <SkeletonElement className={`max-w-[250px]`} />
                    <SkeletonElement className={`max-w-[500px] mt-3`} />
                </div>)}

                <div className=''>
                    {!loading && corte && (
                        <div className="gap-2 ">
                            <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-semibold">Cortes</h1>
                            <p className="dark:text-gray-500 text-gray-700">{corte?.nombre}</p>
                        </div>
                    )}

                    {!loading && producto && (<div className='flex items-center gap-4 my-6'>
                        {/* Titulo */}
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-700 dark:text-gray-200 flex gap-4 items-center">
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
                        <button 
                            className="bg-gray-700 text-white p-2 rounded-[2px] cursor-pointer"
                            title={`Mostrar código de barras`}
                            onClick={() => {
                                setModalActivo("codigo-barra");
                            }}
                        >
                            <LuBarcode />
                        </button>
                        <p className="text-sm text-gray-700 dark:text-gray-300 my-5 hidden">
                            {producto?.formaFarmaceutica && <span> <b>Forma farmacéutica:</b> {producto.formaFarmaceutica}</span>}
                            {producto?.presentacionComercial && <span> • <b>Presentación:</b> {producto.presentacionComercial}</span>}
                            {producto?.concentracion && <span> • <b>Concentración:</b> {producto.concentracion}</span>}
                            {producto?.unidadMedida && <span> • <b>Unidad:</b> {producto.unidadMedida}</span>}
                            {producto?.serie && <span> • <b>Serie:</b> {producto.serie}</span>}
                            {producto?.riesgo && <span> • <b>Riesgo:</b> {producto.riesgo}</span>}
                        </p>
                    </div>)}

                </div>
            </div>

            {loading && (<Spinner />)}
            {!loading && mensajeError && (
                <p className="rounded mt-4 text-center text-sm text-gray-600 dark:text-gray-200">
                    {mensajeError}
               </p>
            )}
            {!mensajeError && !loading && (<>
                <TarjetasInformacionStockProducto  corteId={corteId} productoId={productoId}/> 
                <div className="mt-4 grid gap-4">
                    <ListadoLotesCorte corteId={corteId} />
                    <GraficaProductosCorte />
                    <ListadoMovimientosProductosCorte />
                </div>
            </>)}

            {modalActivo === "codigo-barra" && (
                <ModalMostrarCodigoBarras 
                    cerrarModal={() => setModalActivo(null)}
                    productoSeleccionado = {producto}
                />
            )}
        </>
    );
};

export default CortesProductoPagina;