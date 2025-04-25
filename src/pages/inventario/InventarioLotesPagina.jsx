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

const InventarioLotesPagina = () => {
    const {corteId, loteId} = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [corteSeleccionado, setCorteSeleccionado] = useState();
    const [producto, setProducto] = useState();
    const [lote, setLote] = useState();
    const [errorLote, setErrorLote] = useState(null);
    const [movimientos, setMovimientos] = useState([]);
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
                <InformacionLote />
                <Card className={`col-span-12 xl:col-span-8 2xl:col-span-8 `}>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <CardTitulo>Movimientos</CardTitulo>
                        <div className="flex gap-1 items-center justify-between">
                            {/* <div className="relative hidden md:block">
                                <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar lote..." 
                                    className="input-form pl-10 dark:bg-gray-900"
                                    // value={consulta}
                                    onChange={(e) => {
                                        // setConsulta(e.currentTarget.value);
                                    }}
                                />
                            </div> */}
                            <Button
                                type="button"
                                colorButton="primary"
                                // onClick={() => {
                                //     setModalActivo("crear")
                                // }}
                            >   
                                Crear
                            </Button>
                            <Button
                                type="button"
                                colorButton="secondary"
                                onClick={() => {
                                    // setPaginaActual(1)
                                    // setRefresh((prev) => prev + 1)
                                }}
                            >
                                <LuRefreshCcw />
                            </Button>
                        </div>
                    </div>
                    <div className="min-w-0">
                        <div className="overflow-x-auto w-full">
                            <table className="mt-3 min-w-full">
                                <thead>
                                    <tr className="border-gray-100 border-y text-sm dark:border-gray-800 text-left">
                                        <th className="py-3 px-4">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Tipo</p>
                                        </th>
                                        <th className="py-3 px-4">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Cantidad</p>
                                        </th>
                                        <th className="py-3 px-4 min-w-[120px]">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Fecha</p>
                                        </th>
                                        <th className="py-3 px-4 min-w-[120px]">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Descripción</p>
                                        </th>
                                        <th className="py-3 px-4">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Acciones</p>
                                        </th>
                                    </tr>
                                </thead>
                                {loading && <SkeletonTable rows={7} columns={5}/>}
                                <tbody className="divide-y divide-gray-100  text-sm dark:divide-gray-800">
                                    {/* Display error */}
                                    {!loading && error && (<tr>
                                            <td colSpan="5" className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400 text-center"> {error}</p>
                                            </td>
                                        </tr>)
                                    }

                                    {/* No hay lotes por mostrar */}
                                    {!loading && !error && movimientos.length === 0 && (<tr>
                                            <td colSpan="6" className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400 text-center"> No hay lotes por mostrar</p>
                                            </td>
                                        </tr>
                                    )}

                                    {/* Mapeado de lotes */}
                                    {!loading && !error && movimientos.length > 0 && (
                                        <>
                                            {movimientos.map((movimientos) => {
                                                return (
                                                    <tr 
                                                        key={movimientos.id} 
                                                        className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                                                    >
                                                        <td className="py-3 px-4 capitalize">
                                                            <div className="items-center flex gap-3 rounded-full">
                                                                <p className="text-gray-700 dark:text-gray-400 text-sm">{movimientos.tipo}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <p className="text-gray-700 dark:text-gray-400">{movimientos.cantidad}</p>
                                                        </td>
                                                        <td className="py-3 px-4 lg:gap-2 items-center">
                                                            <p className="text-gray-700 dark:text-gray-400">{movimientos.fecha}</p>
                                                        </td>
                                                        <td className="py-3 px-4 items-center">
                                                            <p className="text-gray-700 dark:text-gray-400">{movimientos.descripcion}</p>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="text-gray-700 dark:text-gray-400 flex gap-2">
                                                                <button 
                                                                    className="cursor-pointer p-1"
                                                                    title="Editar movimiento"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // evita que se dispare el onClick del <tr>
                                                                        // setModalActivo("editar"); 
                                                                        // setMedicamentoSeleccionado(medicamento);
                                                                    }}    
                                                                >
                                                                    <LuPencil />
                                                                </button>
                                                                <button 
                                                                    className="cursor-pointer p-1"
                                                                    title="Eliminar movimiento"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // evita que se dispare el onClick del <tr>
                                                                        // setModalActivo("eliminar"); 
                                                                        // setMedicamentoSeleccionado(medi  camento);
                                                                    }} 
                                                                >
                                                                    <LuEraser />
                                                                </button> 
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Pagination
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        onPageChange={setPaginaActual}
                    />
                </Card>
            </div>
        </Layout>
    );
};

export default InventarioLotesPagina;