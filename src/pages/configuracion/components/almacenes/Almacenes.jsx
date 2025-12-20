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
import { LuEraser, LuPencil, LuSearch } from "react-icons/lu";
import { useEffect, useState } from "react";
import Table from "@/shared/components/Table";
import TableThead from "@/shared/components/TableThead";
import TableTr from "@/shared/components/TableTr";
import TableTh from "@/shared/components/TableTh";
import TableTbody from "@/shared/components/TableTbody";
import TableTd from "@/shared/components/TableTd";

const Almacenes = () => {
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
                const respuesta = await obtenerAlmacenes(paginaActual, debouncedConsulta)
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
    }, [debouncedConsulta, paginaActual])

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
                <div className="mt-4">
                    <Table>
                        <TableThead>
                            <TableTr>
                                <TableTh>Nombre del almacén</TableTh>
                                <TableTh className="text-center">Acciones</TableTh>
                            </TableTr>
                        </TableThead>
                        {loading && <SkeletonTable rows={7} columns={2} />}
                        <TableTbody>
                            {!loading && error && (
                                <TableTr>
                                    <TableTd colSpan={2}>{error}</TableTd>
                                </TableTr>
                            )}
                            {!loading && !error && almacenes.length === 0 && (
                                <TableTr>
                                    <TableTd colSpan={2}>No hay almacenes por mostrar</TableTd>
                                </TableTr>
                            )}
                            {!loading && !error && almacenes.length > 0 && (
                                almacenes.map(almacen => {
                                    return <TableTr key={almacen.id}>
                                        <TableTd>{almacen.nombre}</TableTd>
                                        <TableTd>
                                            <div className="flex justify-center gap-2">
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
                                        </TableTd>
                                    </TableTr>
                                })
                            )}
                        </TableTbody>
                    </Table>
                    {!loading && (
                        <Pagination
                            paginaActual={paginaActual}
                            totalPaginas={totalPaginas}
                            onPageChange={setPaginaActual}
                        />
                    )}
                </div>
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