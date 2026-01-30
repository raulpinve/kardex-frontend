import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '@/shared/components/Spinner';
import TarjetasInformacionStockLote from './components/lotes/TarjetasInformacionStockLote';
import { obtenerCorte } from './services/cortesServices';
import { obtenerLote } from './services/lotesServices';
import ErrorPage from '@/shared/components/ErrorPage';
import SubirImagenProducto from '../productos/components/producto/SubirImagenProducto';
import { LuBarcode, LuChevronRight } from 'react-icons/lu';
import ModalMostrarCodigoBarras from '../productos/components/productos/ModalMostrarCodigoBarras';
import ListadoMovimientosLotesCorte from './components/movimientos/ListadoMovimientosLotesCorte';
import GraficaStockLotesCorte from './components/lotes/GraficaStockLotesCorte';

const CortesLotePagina = () => {
    const [modalActivo, setModalActivo] = useState();
    const [loading, setLoading] = useState(true);
    const [ corte, setCorte ] = useState();
    const {corteId, loteId} = useParams();
    const [lote, setLote] = useState();
    const [error, setError] = useState();
    const [refreshKey, setRefreshKey] = useState(0);

    // Obtener información del producto en el corte
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const resCorte = await obtenerCorte(corteId );
                setCorte(resCorte.data);

                const resProducto = await obtenerLote( loteId );
                setLote(resProducto.data);
            } catch (error) {
                const statusCode = error?.response?.data?.statusCode || 500;
                const message = error?.response?.data?.message || 'Ha ocurrido un error interno';
                setError({ code: statusCode, message });
            } finally {
                setLoading(false);
            }
        };

        if (!loteId) return;
        fetchData();
    }, [corteId, loteId]);

    const recargarTodo = () => {
        setRefreshKey(k => k + 1);
    }

    if(error){
        return <ErrorPage {...error} />
    }

    return (<>
        {loading && (<Spinner />)}
        
        {!loading && corte && (
            <div className="gap-2 mt-3">
                <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-semibold">Cortes</h1>
                <p className="dark:text-gray-500 text-gray-700">{corte?.nombre}</p>
            </div>
        )}

        {/* Título */}
        {!loading && lote && (<div className='flex items-center gap-4 my-6'>
            {/* Titulo */}
            <h1 className="text-2xl font-semibold tracking-tight text-gray-700 dark:text-gray-200 flex gap-4 items-center">
                <SubirImagenProducto 
                    producto={lote.producto}
                    allowChangeImagen = {false}
                />
                <div>
                    <span> {lote.producto?.nombre?.charAt(0).toUpperCase() + lote.producto?.nombre?.slice(1)}</span>
                    <p className="text-sm font-normal text-gray-600 capitalize -mt-[3px]">{lote.producto.tipo}</p>
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
            <LuChevronRight className='dark:text-gray-200' />
            <h1 className="text-2xl text-gray-800 dark:text-gray-200 font-semibold">{lote?.numeroLote}</h1>
        </div>)}
      
        {!loading && corte && (<div className='mt-8'>
            <TarjetasInformacionStockLote refreshKey={refreshKey} corteId={corteId} loteId={loteId} /> 
            <div className="mt-4 grid gap-4">
                <GraficaStockLotesCorte refreshKey={refreshKey}/>
                <ListadoMovimientosLotesCorte onCambioMovimientos={recargarTodo} />
            </div>
        </div>)}

        {modalActivo === "codigo-barra" && (
            <ModalMostrarCodigoBarras 
                cerrarModal={() => setModalActivo(null)}
                productoSeleccionado = {lote?.producto}
            />
        )}
    </>);
};

export default CortesLotePagina;