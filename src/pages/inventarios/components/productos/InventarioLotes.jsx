import React, { useEffect, useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import Button from '../../../../shared/components/Button';
import { LuRefreshCcw, LuSearch } from 'react-icons/lu';
import Pagination from '../../../../shared/components/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerCorteLotes } from '../../services/cortesServices';
import { useSelector } from 'react-redux';
import SkeletonTable from '../../../../shared/components/SkeletonTable';
import useDebounce from '../../../../shared/hooks/useDebounce';

const InventarioLotes = ({corteId}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [refresh, setRefresh] = useState(1);
    const [consulta, setConsulta] = useState("");
    const [lotes, setLotes] = useState([]);
    const token = useSelector(state => state.auth.token);
    const navigate = useNavigate();
    const {productoId, periodo} = useParams();
    const debouncedConsulta = useDebounce(consulta, 500);

    // Obtener la información del corte lote
    useEffect(() => {
        const fetchCorteLote = async() => {
            setLoading(true);
            try {
                const respuesta = await obtenerCorteLotes(token, corteId, productoId, paginaActual, consulta);
                if(respuesta.data){
                    setLotes(respuesta.data);
                    setPaginaActual(respuesta.paginacion.paginaActual);
                    setTotalPaginas(respuesta.paginacion.totalPaginas);
                }
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno. Por favor, inténtalo nuevamente.")              
            } finally {
                setLoading(false);
            }
        }
        if(corteId && productoId){
            fetchCorteLote();
        }
    }, [corteId, productoId, token, refresh, debouncedConsulta, consulta, paginaActual])

    const redireccionar = (loteId) => {
        navigate(`/inventarios/${periodo}/${loteId}/lote`)
    }
    return (
        <Card className={`h-full flex flex-col`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <CardTitulo>Lotes</CardTitulo>
                <div className="flex gap-1 items-center justify-between">
                    <div className="relative hidden md:block">
                        <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            className="input-form pl-10 dark:bg-gray-900"
                            value={consulta}
                            onChange={(e) => {
                                setConsulta(e.currentTarget.value);
                            }}
                        />
                    </div>
                    {/* <Button
                        type="button"
                        colorButton="secondary"
                        onClick={() => {
                            setPaginaActual(1)
                            setRefresh((prev) => prev + 1)
                        }}
                    >
                        <LuRefreshCcw />
                    </Button> */}
                </div>
            </div>
            <div className="min-w-0 flex-grow">
                <div className="overflow-x-auto w-full ">
                    <table className="mt-3 min-w-max w-full">
                        <thead>
                            <tr className="border-gray-100 border-y text-sm dark:border-gray-800 text-left">
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Número de lote</p>
                                </th>                            
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Stock inicial</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Ingresos</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Salidas</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">
                                        {corteId?.cerrado ? "Stock final": "Stock final"}
                                    </p>
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
                            {!loading && !error && lotes.length === 0 && (<tr>
                                    <td colSpan="5" className="py-3 px-4">
                                        <p className="text-gray-700 dark:text-gray-400 text-center"> No hay lotes por mostrar</p>
                                    </td>
                                </tr>
                            )}

                            {/* Mapeado de lotes */}
                            {!loading && !error && lotes.length > 0 && (
                                <>
                                    {lotes.map((lote) => {
                                        return (
                                            <tr 
                                                key={lote.id} 
                                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                                                onClick={() => {
                                                    redireccionar(lote.id);
                                                }}
                                            >
                                                <td className="py-3 px-4 ">
                                                    <div className="items-center flex gap-3 rounded-full">
                                                        <p className="text-gray-700 dark:text-gray-400 text-sm">{lote.numeroLote}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="text-gray-700 dark:text-gray-400">{lote.stockInicial || "-----"}</p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="text-gray-700 dark:text-gray-400">{lote.ingresos || "-----"}</p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="text-gray-700 dark:text-gray-400">{lote.salidas || "-----"}</p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="text-gray-700 dark:text-gray-400">{lote.stockFinal || "-----"}</p>
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
    );
};

export default InventarioLotes;