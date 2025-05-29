import SkeletonTable from "../../../../shared/components/SkeletonTable";
import Pagination from "../../../../shared/components/Pagination";
import CardTitulo from "../../../../shared/components/CardTitulo";
import { obtenerAlmacenes } from "../../services/almacenService";
import useDebounce from "../../../../shared/hooks/useDebounce";
import Card from "../../../../shared/components/Card";
import Button from "../../../../shared/components/Button";
import ModalCrearAlmacen from "./ModalCrearAlmacen";
import ModalEditarAlmacen from "./ModalEditarAlmacen";
import ModalEliminarAlmacen from "./ModalEliminarAlmacen";
import { LuEraser, LuPencil, LuRefreshCcw, LuSearch } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Almacenes = () => {
    const token = useSelector(state => state.auth.token);
    const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null);
    const [modalActivo, setModalActivo] = useState(null); 
    const [almacenes, setAlmacenes] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [consulta, setConsulta] = useState("");

    const debouncedConsulta = useDebounce(consulta, 500);

    // Obtener almacenes
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            setError(null); 
            try {
                const respuesta = await obtenerAlmacenes(token, paginaActual, debouncedConsulta)
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
    }, [debouncedConsulta, token, paginaActual])

    return (
        <>
            <Card>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <CardTitulo>Almacenes</CardTitulo>
                    <div className="flex gap-1 items-center justify-between">
                        <Button
                            type="button"
                            className="ml-3"
                            colorButton="primary"
                            onClick={() => {
                                setModalActivo("crear")
                            }}
                        >   
                            Crear 
                        </Button>
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
                    </div>
                </div>
    
                <table className="min-w-full mt-3">
                    <thead className='sticky top-0 bg-white dark:bg-gray-800'>
                        <tr className="border-gray-100 border-y  text-sm dark:border-gray-800 text-left">
                            <th className="py-3 px-4">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Nombre del almacén</p>
                            </th>
                            <th className="py-3 px-4 w-[130px]">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Acciones</p>
                            </th>
                        </tr>
                    </thead>
                    {loading ? <SkeletonTable rows={5} columns={2}/>: 
                        <tbody className="divide-y divide-gray-100  text-sm dark:divide-gray-800">
                            {error ? <tr>
                                <td colSpan="5" className="py-3 px-4">
                                    <p className="text-gray-700 dark:text-gray-400 text-center"> {error}</p>
                                </td>
                            </tr> : 
                            <>
                                {almacenes.length === 0 ? 
                                    <tr>
                                        <td colSpan="5" className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400 text-center"> No hay almacenes por mostrar</p>
                                        </td>
                                    </tr>: 
                                    <>
                                        {almacenes.map(almacen => {
                                            return <tr key={almacen.id}>
                                                <td className="py-3 px-4">
                                                    <p className="text-gray-700 dark:text-gray-400"> {almacen.nombre} </p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-gray-700 dark:text-gray-400 flex gap-2">
                                                        <button 
                                                            className="cursor-pointer p-1"
                                                            title="Editar almacén"
                                                            onClick={() => {
                                                                setModalActivo("editar"); 
                                                                setAlmacenSeleccionado(almacen);
                                                            }}    
                                                        >
                                                            <LuPencil />
                                                        </button>
                                                        <button 
                                                            className="cursor-pointer p-1"
                                                            title="Eliminar almacén"
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
                {!loading && (
                    <Pagination
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        onPageChange={setPaginaActual}
                    />
                )}
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