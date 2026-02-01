import Pagination from "../../shared/components/Pagination";
import SkeletonTable from "../../shared/components/SkeletonTable";
import ModalCrearProducto from "./components/productos/ModalCrearProducto";
import ModalEditarProducto from "./components/productos/ModalEditarProducto";
import ModalEliminarProducto from "./components/productos/ModalEliminarProducto";
import ModalAbrirImagenPerfil from "../../shared/components/ModalAbrirImagenPerfil";
import { LuBarcode, LuChevronDown, LuEraser, LuPencil, LuSearch } from "react-icons/lu";
import { obtenerProductos } from './services/productoServices';
import CardTitulo from "../../shared/components/CardTitulo";
import imageDefault from "../../assets/images/image-default.png";
import useDebounce from '../../shared/hooks/useDebounce';
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { host } from '../../utils/config';
import { obtenerTodasCategorias } from "./services/categoriaServices";
import ModalMostrarCodigoBarras from "./components/productos/ModalMostrarCodigoBarras";
import Table from "@/shared/components/Table";
import TableThead from "@/shared/components/TableThead";
import TableTr from "@/shared/components/TableTr";
import TableTh from "@/shared/components/TableTh";
import TableTbody from "@/shared/components/TableTbody";
import TableTd from "@/shared/components/TableTd";
import { formatCantidad } from "@/utils/utilities";

const ProductosPagina = ({ tipo }) => {
    const almacen = useSelector(state => state.almacen.almacen);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [consulta, setConsulta] = useState("");
    const [productos, setProductos] = useState([]);
    const [modalActivo, setModalActivo] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const debouncedConsulta = useDebounce(consulta, 500);
    
    // Obtener productos 
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            setError(null); 
            
            try {
                const respuesta = await obtenerProductos(tipo, almacen.id, paginaActual, debouncedConsulta, categoriaSeleccionada)
                setProductos(respuesta.data)
                setPaginaActual(respuesta.paginacion.paginaActual);
                setTotalPaginas(respuesta.paginacion.totalPaginas);
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno");
            } finally {
                setLoading(false);
            }
        }
        if(almacen){
            fetchUsuarios();
        }
    }, [debouncedConsulta, almacen, paginaActual, tipo, categoriaSeleccionada]);

    // Obtener categorias
    useEffect(() => {
        const fecthCategorias = async() => {
            try {
                const result = await obtenerTodasCategorias(tipo === "medicamentos" ? "medicamento": "dispositivo");
                setCategorias(result.data)
            } catch (error) {
                console.error(error);
            }
        }
        fecthCategorias();

    }, [tipo])

    // Redireccionar   
    const irAProducto = (id) => {
        navigate(`/${tipo}/${id}`);
    };

    return (<>
        <div className="mt-4">
            <Card>
                {/* Header */}
                <div className="lg:flex lg:justify-between lg:items-center">
                    <CardTitulo><span className="capitalize">{tipo}</span></CardTitulo>
                    <div className="lg:flex lg:gap-1 lg:items-center lg:justify-between">
                        <Button
                            type="button"
                            colorButton="primary"
                            onClick={() => {
                                setModalActivo("crear");
                            }}
                        >   
                            Crear
                        </Button>
                        <div className="relative hidden md:block">
                            <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                            <input
                                type="text"
                                placeholder={`Buscar ${tipo} por nombre o código...`}
                                className="input-form pl-10 dark:bg-gray-900 w-full dark:text-white"
                                value={consulta}
                                onChange={(e) => setConsulta(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setConsulta(e.currentTarget.value.trim());
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                        <div className="relative hidden lg:block">
                            <select
                                className={`select-form max-w-[210px]`}
                                value={categoriaSeleccionada}
                                onChange={(e) => setCategoriaSeleccionada(e.currentTarget.value)}
                            >
                            <option value="">Seleccionar categoría...</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                            <LuChevronDown className="absolute top-[15px] right-2.5 dark:text-white" />
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <Table>
                        <TableThead>
                            <TableTr>
                                <TableTh>{ tipo === "medicamentos" ? "Principio activo": "Nombre" }</TableTh>
                                <TableTh>Categoría</TableTh>
                                <TableTh className="text-center">Cód. barras</TableTh>
                                <TableTh className="text-center">Stock disponible</TableTh>
                                <TableTh className="text-center">Acciones</TableTh>
                            </TableTr>
                        </TableThead>

                        {/* Loading */}
                        {loading && (
                            <SkeletonTable rows={7} columns={tipo === "medicamentos" ? 9 : 8 } />
                        )}
                        <TableTbody>
                            {/* Mostrar error */}
                            {!loading && error && (
                                <tr>
                                    <TableTd colSpan={tipo === "medicamentos" ? 9 : 8}>{error}</TableTd>
                                </tr>
                            )}
                            {!loading && !error && productos.length === 0 && (
                                <tr>
                                    <TableTd colSpan={tipo === "medicamentos" ? 9 : 8}> No hay {tipo} por mostrar</TableTd>
                                </tr>
                            )}
                            {!loading && !error && productos.length > 0 && (
                                productos.map(producto => {
                                    return <tr 
                                        key={producto.id}
                                        onClick={() => irAProducto(producto.id)}
                                        className="cursor-pointer"
                                    >   
                                        <TableTd>
                                            <div className="w-full flex items-center gap-3">
                                                <img 
                                                    src={`${producto.avatarThumbnail}`}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = imageDefault; 
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setModalActivo("imagen-perfil");
                                                        setProductoSeleccionado(producto);
                                                    }}
                                                    alt="Perfil" 
                                                    className="w-8 h-8 block object-cover rounded-full select-none cursor-pointer"  
                                                />
                                                <p className="text-gray-700 dark:text-gray-400"> {producto.nombre}</p>
                                            </div>
                                        </TableTd>
                                        <TableTd>{producto?.categoriaNombre ? producto?.categoriaNombre : "---"}</TableTd>
                                        <TableTd>
                                            <p className="text-gray-700 dark:text-gray-400 text-center"> 
                                                { producto?.codigoBarra }
                                                <button 
                                                    className="cursor-pointer ml-2 p-1 rounded-[2px] bg-gray-700 text-white"
                                                    title={`Mostrar código de barras`}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        setModalActivo("codigo-barra");
                                                        setProductoSeleccionado(producto);
                                                    }}    
                                                >
                                                    <LuBarcode />
                                                </button>
                                            </p>
                                        </TableTd>
                                        <TableTd className="text-center">{ formatCantidad(producto.stockDisponible) }</TableTd>
                                        <TableTd>
                                            <div className="flex justify-center gap-1">
                                                <button 
                                                    className="cursor-pointer p-1"
                                                    title={`Editar ${tipo === "medicamentos" ? "medicamento": "dispositivo"}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        setModalActivo("editar"); 
                                                        setProductoSeleccionado(producto);
                                                    }}    
                                                >
                                                    <LuPencil />
                                                </button>
                                                <button 
                                                    className="cursor-pointer p-1"
                                                    title={`Eliminar ${tipo === "medicamentos" ? "medicamento": "dispositivo"}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        setModalActivo("eliminar"); 
                                                        setProductoSeleccionado(producto);
                                                    }} 
                                                >
                                                    <LuEraser />
                                                </button> 
                                            </div>
                                        </TableTd>
                                    </tr>
                                })
                            )}
                            
                        </TableTbody>
                    </Table>
                </div>
                <Pagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onPageChange={setPaginaActual}
                />
            </Card>
        </div>

        {modalActivo === "crear" && almacen && (
            <ModalCrearProducto 
                cerrarModal={() => setModalActivo(null)}
                setProductos = {setProductos}
                tipo = {tipo}
                almacenId = {almacen.id}
            />
        )}

        {modalActivo === "codigo-barra" && (
            <ModalMostrarCodigoBarras 
                cerrarModal={() => setModalActivo(null)}
                productoSeleccionado = {productoSeleccionado}
                tipo = {tipo}
            />
        )}

        {modalActivo === "editar" && (
            <ModalEditarProducto 
                cerrarModal={() => setModalActivo(null)}
                setProductos = {setProductos}
                productoSeleccionado = {productoSeleccionado}
                tipo = {tipo}
            />
        )}
        
        {modalActivo === "eliminar" && (
            <ModalEliminarProducto 
                cerrarModal={() => setModalActivo(null)}
                setProductos = {setProductos}
                productoSeleccionado = {productoSeleccionado}
                tipo = {tipo}
            />
        )}
            
        {modalActivo === "imagen-perfil" && (
            <ModalAbrirImagenPerfil 
                cerrarModal={() => setModalActivo(null)}
                urlImage = {productoSeleccionado?.avatar}
                tipo={tipo}
            />
        )}
    </>);
}
export default ProductosPagina;