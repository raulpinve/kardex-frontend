import { LuChevronDown, LuEraser, LuPencil, LuSearch } from "react-icons/lu";
import SkeletonTable from "../../../../shared/components/SkeletonTable";
import { obtenerCategorias } from "../../services/categoriaService";
import CardTitulo from "../../../../shared/components/CardTitulo";
import Pagination from "../../../../shared/components/Pagination";
import useDebounce from "../../../../shared/hooks/useDebounce";
import ModalEliminarCategoria from "./ModalEliminarCategoria";
import ModalEditarCategoria from "./ModalEditarCategoria";
import Button from "../../../../shared/components/Button";
import ModalCrearCategoria from "./ModalCrearCategoria";
import Card from "../../../../shared/components/Card";
import { useEffect, useState } from "react";
import TableThead from "@/shared/components/TableThead";
import TableTr from "@/shared/components/TableTr";
import Table from "@/shared/components/Table";
import TableTh from "@/shared/components/TableTh";
import TableTbody from "@/shared/components/TableTbody";
import TableTd from "@/shared/components/TableTd";

const TIPO = {
    "dispositivo": "Dispositivo", 
    "medicamento": "Medicamento"
}

const Categorias = () => {
    const [modalActivo, setModalActivo] = useState(null); 
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [tipo, setTipo] = useState("");
    const [consulta, setConsulta] = useState("");
    
    const debouncedConsulta = useDebounce(consulta, 500);

    // Obtener categorias
    useEffect(() => {
        const fetchCategorias = async () => {
            setLoading(true);
            setError(null); 
            try {
                const respuesta = await obtenerCategorias(paginaActual, tipo, debouncedConsulta);
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
    }, [debouncedConsulta, tipo, paginaActual]);

    return (
        <>
            <Card>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <CardTitulo>Categorías</CardTitulo>
                    <div className="flex gap-1 justify-between  ml-2">
                        <Button
                            type="button"
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
                                className="input-form pl-10 dark:bg-gray-900 max-w-[180px]"
                                value={consulta}
                                onChange={(e) => {
                                    setConsulta(e.currentTarget.value);
                                }}
                            />
                        </div>
                        <div className="relative block">
                            <select 
                                className="select-form" 
                                value={tipo}
                                onChange={(e) => {
                                    setTipo(e.currentTarget.value)
                                }}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="dispositivo">Dispositivo</option>
                                <option value="medicamento">Medicamento</option>
                            </select>
                            <LuChevronDown className="absolute top-[16px] right-2 dark:text-gray-200" />
                        </div>
                    </div>
                </div>
                
                <div className="mt-4">
                    <Table>
                        <TableThead>
                            <TableTr>
                                <TableTh>Nombre de la categoría</TableTh>
                                <TableTh>Tipo</TableTh>
                                <TableTh className="text-center">Acciones</TableTh>
                            </TableTr>
                        </TableThead>
                        {loading && <SkeletonTable rows={7} columns={3} />}
                        <TableTbody>
                            {!loading && error && (
                                <TableTr>
                                    <TableTd colSpan={3}>{error}</TableTd>
                                </TableTr>
                            )}
                            {!loading && !error && categorias.length === 0 && (
                                <TableTr>
                                    <TableTd colSpan={3}>No hay categorias por mostrar</TableTd>
                                </TableTr>
                            )}
                            {!loading && !error && categorias.length > 0 && (
                                categorias.map(categoria => {
                                    return <TableTr key={categoria.id}>
                                       <TableTd>{categoria.nombre} </TableTd>
                                       <TableTd>{TIPO[categoria.tipo]}</TableTd>
                                       <TableTd>
                                            <div className="flex gap-2 items-center justify-center">
                                                <button 
                                                    className="cursor-pointer p-1"
                                                    title="Editar categoria"
                                                    onClick={() => {
                                                        setModalActivo("editar"); 
                                                        setCategoriaSeleccionada(categoria);
                                                    }}    
                                                >
                                                    <LuPencil />
                                                </button>
                                                <button 
                                                    className="cursor-pointer p-1"
                                                    title="Eliminar categoria"
                                                    onClick={() => {
                                                        setCategoriaSeleccionada(categoria);
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