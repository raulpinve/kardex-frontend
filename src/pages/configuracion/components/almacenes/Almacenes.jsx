import React, { useEffect, useState } from "react";
import Card from "../../../../shared/components/Card";
import CardTitulo from "../../../../shared/components/CardTitulo";
import Button from "../../../../shared/components/Button";
import { LuEraser, LuLock, LuPencil, LuRefreshCcw } from "react-icons/lu";
import { useSelector } from "react-redux";
import Pagination from "../../../../shared/components/Pagination";
import ModalCrearAlmacen from "./ModalCrearAlmacen";
import { obtenerAlmacenes } from "../../services/almacenService";
import SkeletonTable from "../../../../shared/components/SkeletonTable";
import ModalEditarAlmacen from "./ModalEditarAlmacen";
import ModalEliminarAlmacen from "./ModalEliminarAlmacen";

const Almacenes = () => {
    const [modalActivo, setModalActivo] = useState(null); // Establece la modal que estará activa
    const [almacenes, setAlmacenes] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const token = useSelector(state => state.auth.token);
    const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null);
    const [refresh, setRefresh] = useState(0); 
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // Obtener almacenes
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            setError(null); 
            try {
                const respuesta = await obtenerAlmacenes(token, paginaActual)
                setAlmacenes(respuesta.data)
                setPaginaActual(respuesta.paginacion.paginaActual);
                setTotalPaginas(respuesta.paginacion.totalPaginas);

            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno");
            } finally {
                setLoading(false);
            }
        }
        fetchUsuarios();
    }, [token, refresh, paginaActual])

    return (
        <>
            <Card>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <CardTitulo>Almacenes</CardTitulo>
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
                        <Button
                            type="button"
                            colorButton="secondary"
                            onClick={() => {
                                setPaginaActual(1)
                                setRefresh((prev) => prev + 1)
                            }}
                        >
                            <LuRefreshCcw />
                        </Button>
                    </div>
                </div>
    
                <table className="min-w-full mt-3">
                    <thead>
                        <tr className="border-gray-100 border-y  text-sm dark:border-gray-800 text-left">
                            <th className="py-3">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Nombre del almacén</p>
                            </th>
                            <th className="py-3 w-[100px]">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Acciones</p>
                            </th>
                        </tr>
                    </thead>
                    {loading ? <SkeletonTable rows={7} columns={5}/>: 
                        <tbody className="divide-y divide-gray-100  text-sm dark:divide-gray-800">
                            {error ? <tr>
                                <td colSpan="5" className="py-3">
                                    <p className="text-gray-700 dark:text-gray-400 text-center"> {error}</p>
                                </td>
                            </tr> : 
                            <>
                                {almacenes.length === 0 ? 
                                    <tr>
                                        <td colSpan="5" className="py-3">
                                            <p className="text-gray-700 dark:text-gray-400 text-center"> No hay almacenes por mostrar</p>
                                        </td>
                                    </tr>: 
                                    <>
                                        {almacenes.map(almacen => {
                                            return <tr key={almacen.id}>
                                                <td className="py-3">
                                                    <p className="text-gray-700 dark:text-gray-400"> {almacen.nombre} </p>
                                                </td>
                                                <td className="py-3">
                                                    <div className="text-gray-700 dark:text-gray-400 flex gap-2">
                                                        <button 
                                                            className="cursor-pointer"
                                                            title="Editar usuario"
                                                            onClick={() => {
                                                                setModalActivo("editar"); 
                                                                setAlmacenSeleccionado(almacen);
                                                            }}    
                                                        >
                                                            <LuPencil />
                                                        </button>
                                                        <button 
                                                            className="cursor-pointer"
                                                            title="Eliminar usuario"
                                                            onClick={() => {
                                                                setAlmacenSeleccionado(almacen);
                                                                setModalActivo("eliminar"); 
                                                            }} 
                                                        >
                                                            <LuEraser />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        })}
                                    </>}
                                </>}
                        </tbody>
                    }
                </table>
                <Pagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onPageChange={setPaginaActual}
                />
            </Card>

            {modalActivo === "crear" && (
                <ModalCrearAlmacen 
                    cerrarModal={() => setModalActivo(null)} 
                    setAlmacenes = {setAlmacenes}
                />
            )}

            {modalActivo === "editar" && (
                <ModalEditarAlmacen 
                    cerrarModal={() => setModalActivo(null)} 
                    setAlmacenes = {setAlmacenes}
                    almacenSeleccionado = {almacenSeleccionado}
                />
            )}

            
            {modalActivo === "eliminar" && (
                <ModalEliminarAlmacen 
                    cerrarModal={() => setModalActivo(null)} 
                    setAlmacenes = {setAlmacenes}
                    almacenSeleccionado = {almacenSeleccionado}
                />
            )}

        </>
    );
};

export default Almacenes;