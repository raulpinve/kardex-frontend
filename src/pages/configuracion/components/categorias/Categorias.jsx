import React, { useEffect, useState } from "react";
import Card from "../../../../shared/components/Card";
import CardTitulo from "../../../../shared/components/CardTitulo";
import Button from "../../../../shared/components/Button";
import { LuEraser, LuLock, LuPencil, LuRefreshCcw, LuSearch } from "react-icons/lu";
import { useSelector } from "react-redux";
import Pagination from "../../../../shared/components/Pagination";
import { obtenerCategorias } from "../../services/categoriaService";
import SkeletonTable from "../../../../shared/components/SkeletonTable";
import ModalCrearCategoria from "./ModalCrearCategoria";
import ModalEditarCategoria from "./ModalEditarCategoria";
import ModalEliminarCategoria from "./ModalEliminarCategoria";
import useDebounce from "../../../../shared/hooks/useDebounce";

const Categorias = () => {
    const token = useSelector(state => state.auth.token);
    const [modalActivo, setModalActivo] = useState(null); 
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [refresh, setRefresh] = useState(0); 
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [tipo, setTipo] = useState("");
    const [consulta, setConsulta] = useState("");

    const TIPO = {
        "dispositivo": "Dispositivo", 
        "medicamento": "Medicamento"
    }

    const debouncedConsulta = useDebounce(consulta, 500);

    // Obtener categorias
    useEffect(() => {
        const fetchCategorias = async () => {
            setLoading(true);
            setError(null); 
            try {
                const respuesta = await obtenerCategorias(token, paginaActual, tipo, debouncedConsulta);
                setCategorias(respuesta.data);
                setPaginaActual(respuesta.paginacion.paginaActual);
                setTotalPaginas(respuesta.paginacion.totalPaginas);
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno.");
            } finally {
                setLoading(false);
            }
        }
        fetchCategorias();
    }, [debouncedConsulta, tipo, paginaActual, token, refresh]);

    return (
        <>
            <Card>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <CardTitulo>Categorías</CardTitulo>
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
                        <div className="relative hidden md:block">
                            <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                            <input 
                                type="text" 
                                placeholder="Buscar categoría..." 
                                className="input-form pl-10 dark:bg-gray-900"
                                value={consulta}
                                onChange={(e) => {
                                    setConsulta(e.currentTarget.value);
                                }}
                            />
                        </div>
                        <select 
                            name="" 
                            className="select-form w-[150px]" 
                            id="" 
                            placeholder="Todos..."
                            value={tipo}
                            onChange={(e) => {
                                setTipo(e.currentTarget.value)
                            }}
                        >
                            <option value="">Todos</option>
                            <option value="dispositivo">Dispositivo</option>
                            <option value="medicamento">Medicamento</option>
                        </select>
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
                {/* Cuerpo */}
                <table className="min-w-full mt-3">
                    <thead>
                        <tr className="border-gray-100 border-y  text-sm dark:border-gray-800 text-left">
                            <th className="py-3">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Nombre de la categoría</p>
                            </th>
                            <th className="py-3">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Tipo</p>
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
                                {categorias.length === 0 ? 
                                    <tr>
                                        <td colSpan="5" className="py-3">
                                            <p className="text-gray-700 dark:text-gray-400 text-center"> No hay categorias por mostrar</p>
                                        </td>
                                    </tr>: 
                                    <>
                                        {categorias.map(categoria => {
                                            return <tr key={categoria.id}>
                                                <td className="py-3">
                                                    <p className="text-gray-700 dark:text-gray-400"> {categoria.nombre} </p>
                                                </td>
                                                <td className="py-3">
                                                    <p className="text-gray-700 dark:text-gray-400"> {TIPO[categoria.tipo]} </p>
                                                </td>
                                                <td className="py-3">
                                                    <div className="text-gray-700 dark:text-gray-400 flex gap-2">
                                                        <button 
                                                            className="cursor-pointer"
                                                            title="Editar categoria"
                                                            onClick={() => {
                                                                setModalActivo("editar"); 
                                                                setCategoriaSeleccionada(categoria);
                                                            }}    
                                                        >
                                                            <LuPencil />
                                                        </button>
                                                        <button 
                                                            className="cursor-pointer"
                                                            title="Eliminar categoria"
                                                            onClick={() => {
                                                                setCategoriaSeleccionada(categoria);
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
                <ModalCrearCategoria 
                    cerrarModal={() => setModalActivo(null)} 
                    setCategorias = {setCategorias}
                />
            )}
            {modalActivo === "editar" && (
                <ModalEditarCategoria 
                    cerrarModal={() => setModalActivo(null)} 
                    setAlmacenes = {setCategorias}
                    categoriaSeleccionada = {categoriaSeleccionada}
                    setCategorias = {setCategorias}
                />
            )}
             
            {modalActivo === "eliminar" && (
                <ModalEliminarCategoria 
                    cerrarModal={() => setModalActivo(null)} 
                    setCategorias = {setCategorias}
                    categoriaSeleccionada = {categoriaSeleccionada}
                />
            )} 

        </>
    );
};

export default Categorias;