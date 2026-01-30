import SubirImagenProducto from './components/producto/SubirImagenProducto';
import { formatCantidad, formatDate, obtenerEstadoVencimiento } from '@/utils/utilities';
import SkeletonElement from '@/shared/components/SkeletonElement';
import { Link, useParams } from 'react-router-dom';
import { LuBarcode, LuChevronRight } from 'react-icons/lu';
import { useEffect, useState } from 'react';
import LotesMovimientos from './components/lotes/LotesMovimientos';
import { obtenerLote } from './services/loteServices';
import GraficaStockLotes from './components/lotes/GraficaStockLotes';
import ModalMostrarCodigoBarras from './components/productos/ModalMostrarCodigoBarras';

const LotePagina = ( )=> {
    const { loteId} = useParams();
    const [loading, setLoading] = useState(false);
    const [producto, setProducto] = useState();
    const [estado, setEstado] = useState();
    const [lote, setLote] = useState(null);
    const [color, setColor] = useState();
    const [modalActivo, setModalActivo] = useState("");
    const [refresh, setRefresh] = useState(0);

    // Obtener la información del producto
    useEffect(() => {
        const fecthLote = async () => {
            try {
                setLoading(true);
                const res = await obtenerLote(loteId);
                setLote(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if(!loteId) return;
        fecthLote()
    }, [loteId, refresh])

    useEffect(() => {
        if(!lote) return

        const { estado, color } = obtenerEstadoVencimiento(lote?.fechaVencimiento);
        setEstado(estado);
        setColor(color);
    }, [lote])

    const updateRefresh = () => {
        setRefresh(prev => prev + 1)
    }

    return (<>

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
      

        {/* Encabezado */}
        <div className=''>
            {loading && !producto && (<>
                <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-200 flex gap-4 items-center my-6">
                    <SkeletonElement className="w-12 h-12 rounded-full"/>
                    <div className="grid gap-2">
                        <SkeletonElement className="w-[120px] h-[20px]"/>
                        <SkeletonElement className="w-[80px] h-[16px]"/>
                    </div>
                    <LuChevronRight />
                    <SkeletonElement className="w-[150px] h-[20px]"/>
                </h1>
            </>)}

            {!loading && producto && lote && (<div>
                {/* Titulo */}
                <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-200 flex gap-4 items-center my-6">
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
            </div>)}
            
            <div className="">
                {loading && !lote && (
                    <div className="grid rounded-2xl border border-gray-200 bg-white mt-3 dark:border-gray-800 dark:bg-white/[0.01] grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800 grid gap-2">
                            <SkeletonElement className="w-[55%] h-[25px]"/>
                            <SkeletonElement className="w-[75%] h-[25px]"/>
                        </div>
                        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800 grid gap-2">
                            <SkeletonElement className="w-[55%] h-[25px]"/>
                            <SkeletonElement className="w-[75%] h-[25px]"/>
                        </div>
                        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800 grid gap-2">
                            <SkeletonElement className="w-[55%] h-[25px]"/>
                            <SkeletonElement className="w-[75%] h-[25px]"/>
                        </div>
                        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800 grid gap-2">
                            <SkeletonElement className="w-[55%] h-[25px]"/>
                            <SkeletonElement className="w-[75%] h-[25px]"/>
                        </div>
                    </div>
                )}
                {!loading && lote && (<>
                
                    <div className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2 xl:grid-cols-4 dark:border-gray-800 dark:bg-white/[0.01] mt-3">
                        {/* Registro sanitario */}
                        <div className="border-b border-gray-200 px-6 py-5 sm:border-r xl:border-b-0 dark:border-gray-800">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Registro sanitario</span>
                            <div className="mt-2 flex items-end gap-3">
                                <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    {lote?.registroSanitario || "---"}
                                </h4>
                            </div>
                        </div>

                        {/* Fecha de vencimiento */}
                        <div className="border-b border-gray-200 px-6 py-5 xl:border-r xl:border-b-0 dark:border-gray-800">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Fecha de vencimiento</span>
                            <div className="mt-2 flex items-end gap-3">
                                <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                    {formatDate(lote?.fechaVencimiento) || "---"}
                                </h4>
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="border-b border-gray-200 px-6 py-5 sm:border-r sm:border-b-0 dark:border-gray-800">
                            <div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Estado</span>
                                <div className="mt-2 flex items-end gap-3">
                                    <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                        {estado && color ? (
                                            <p className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${color} text-right`}>{estado}</p>
                                        ): "---" }
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-5">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Stock disponible</span>
                            <div className="mt-2 flex items-end gap-3">
                            <h4 className="text-title-xs sm:text-title-sm font-bold text-gray-800 dark:text-white/90">
                                {formatCantidad(lote.stockDisponible) || "---"}
                            </h4>
                            </div>
                        </div>
                    </div>
                </>)}
            </div>
        </div>
        <div className="mt-4 grid gap-4">
            <GraficaStockLotes refresh={refresh} />
            <LotesMovimientos loteId={loteId} updateRefresh = {updateRefresh}/>
        </div>
        {modalActivo === "codigo-barra" && (
            <ModalMostrarCodigoBarras 
                cerrarModal={() => setModalActivo(null)}
                productoSeleccionado = {lote?.producto}
            />
        )}
    </>);
};

export default LotePagina;