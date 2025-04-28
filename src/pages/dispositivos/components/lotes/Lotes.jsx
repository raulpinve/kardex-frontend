import React, { useEffect, useState } from "react";
import Card from "../../../../shared/components/Card";
import CardTitulo from "../../../../shared/components/CardTitulo";
import Button from "../../../../shared/components/Button";
import { LuEraser, LuPencil, LuRefreshCcw, LuSearch } from "react-icons/lu";
import { obtenerLotes } from "../../services/loteServices";
import { useSelector } from "react-redux";
import useDebounce from "../../../../shared/hooks/useDebounce";
import SkeletonTable from "../../../../shared/components/SkeletonTable";
import { dateColombiaFormat, obtenerEstadoVencimiento } from "../../../../utils/utilities";
import ModalCrearLote from "./ModalCrearLote";
import Pagination from "../../../../shared/components/Pagination";
import ModalEditarLote from "./ModalEditarLote";
import ModalEliminarLote from "./ModalEliminarLote";

const Lotes = ({dispositivoId}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lotes, setLotes] = useState([]);
    const [loteSeleccionado, setLoteSeleccionado] = useState(null);
    const [refresh, setRefresh] = useState(0); 
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [modalActivo, setModalActivo] = useState(); 
    const token = useSelector(state => state.auth.token);
    const [consulta, setConsulta] = useState("");
    const debouncedConsulta = useDebounce(consulta, 500);

    // Obtener lotes
    useEffect(() => {
        const fetchLotes = async () => {
            setLoading(true);
            setError(null); 
            try {
                const respuesta = await obtenerLotes(token, dispositivoId, paginaActual, debouncedConsulta);
                setLotes(respuesta.data);
                setPaginaActual(respuesta.paginacion.paginaActual);
                setTotalPaginas(respuesta.paginacion.totalPaginas);
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno.");
            } finally {
                setLoading(false);
            }
        }
        fetchLotes();
    }, [debouncedConsulta, paginaActual, token, refresh]);
    
    return (
        <>
            <Card>
                <div className="flex justify-between items-center">
                    <CardTitulo>Lotes</CardTitulo>
                    <div className="flex gap-1 items-center justify-between">
                        <Button
                            type="button"
                            colorButton="secondary"
                            onClick={() => {
                                setModalActivo("crear")
                            }}
                        >   
                            Crear
                        </Button>
                        <div className="relative hidden lg:block">
                            <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                            <input 
                                type="text" 
                                placeholder="Buscar lote..." 
                                className="input-form pl-10 dark:bg-gray-900"
                                value={consulta}
                                onChange={(e) => {
                                    setConsulta(e.currentTarget.value);
                                }}
                            />
                        </div>
                        
                        <Button
                            type="button"
                            colorButton="secondary"
                            className="hidden md:block"
                            onClick={() => {
                                setPaginaActual(1)
                                setRefresh((prev) => prev + 1)
                            }}
                        >
                            <LuRefreshCcw />
                        </Button>
                    </div>
                </div>
                <div className="min-w-0">
                    <div className="overflow-x-auto w-full">
                        <table className="mt-3 min-w-full  text-gray-700 dark:text-gray-200">
                            <thead>
                                <tr className="border-gray-100 border-y text-sm dark:border-gray-800 text-left">
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Número de lote</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Registro sanitario</p>
                                    </th>
                                    <th className="py-3 px-4 min-w-[120px]">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Fecha de vencimiento</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Stock disponible</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Acciones</p>
                                    </th>
                                </tr>
                            </thead>
                            {loading && <SkeletonTable rows={7} columns={5}/>}
                            <tbody className="text-sm">
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
                                        const { estado, color } = obtenerEstadoVencimiento(lote.fechaVencimiento);

                                        return (
                                            <tr key={lote.id} className=" text-sm">
                                                <td className="py-3 px-4">
                                                    <div className="items-center flex gap-3 rounded-full">
                                                        <p className="text-gray-700 dark:text-gray-400 text-sm">{lote.numeroLote}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="text-gray-700 dark:text-gray-400">{lote.registroSanitario}</p>
                                                </td>
                                                <td className="py-3 px-4 lg:flex lg:gap-2 items-center">
                                                    <p className="text-gray-700 dark:text-gray-400">{dateColombiaFormat(lote.fechaVencimiento)}</p>
                                                    <p className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${color}`}>
                                                        {estado}
                                                    </p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="text-gray-700 dark:text-gray-400">{lote.stockDisponible}</p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-gray-700 dark:text-gray-400 flex gap-2">
                                                    <button
                                                        className="cursor-pointer"
                                                        title="Editar lote"
                                                        onClick={() => {
                                                            setModalActivo("editar");
                                                            setLoteSeleccionado(lote);
                                                        }}
                                                    >
                                                        <LuPencil />
                                                    </button>
                                                    <button
                                                        className="cursor-pointer"
                                                        title="Eliminar lote"
                                                        onClick={() => {
                                                            setLoteSeleccionado(lote);
                                                            setModalActivo("eliminar");
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
            {modalActivo === "crear" && (
                <ModalCrearLote 
                    cerrarModal={() => setModalActivo(null)} 
                    setLotes = {setLotes}
                    dispositivoId = {dispositivoId}
                    loteSeleccionado = {loteSeleccionado}
                />
            )}
            {modalActivo === "editar" && (
                <ModalEditarLote 
                    cerrarModal={() => setModalActivo(null)} 
                    setLotes = {setLotes}
                    loteSeleccionado = {loteSeleccionado}
                />
            )}
            {modalActivo === "eliminar" && (
                <ModalEliminarLote 
                    cerrarModal={() => setModalActivo(null)} 
                    setLotes = {setLotes}
                    loteSeleccionado = {loteSeleccionado}
                />
            )} 
        </>
    );
};

export default Lotes;