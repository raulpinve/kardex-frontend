import Pagination from "../../shared/components/Pagination";
import SkeletonTable from "../../shared/components/SkeletonTable";
import ModalCrearProducto from "./components/productos/ModalCrearProducto";
import ModalEditarProducto from "./components/productos/ModalEditarProducto";
import ModalEliminarProducto from "./components/productos/ModalEliminarProducto";
import ModalAbrirImagenPerfil from "../../shared/components/ModalAbrirImagenPerfil";
import { LuEraser, LuPencil, LuSearch } from "react-icons/lu";
import { obtenerProductos } from './services/productoServices';
import CardTitulo from "../../shared/components/CardTitulo";
import imageDefault from "../../assets/image-default.png";
import useDebounce from '../../shared/hooks/useDebounce';
import Layout from '../../shared/components/Layout';
import Button from "../../shared/components/Button";
import Card from "../../shared/components/Card";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { host } from '../../utils/config';

const ProductosPagina = ({ tipo }) => {
    const almacen = useSelector(state => state.almacen.almacen);
    const token = useSelector(state => state.auth.token);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [consulta, setConsulta] = useState("");
    const [productos, setProductos] = useState([]);
    const [modalActivo, setModalActivo] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const debouncedConsulta = useDebounce(consulta, 500);
    
    // Obtener productos 
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            setError(null); 
            
            try {
                const respuesta = await obtenerProductos(token, tipo, almacen.id, paginaActual, debouncedConsulta)
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
    }, [debouncedConsulta, almacen, token, paginaActual, tipo]);

    // Redireccionar   
    const irAProducto = (id) => {
        navigate(`/${tipo}/${id}`);
    };

    return (
        <>
            <Layout>
                <div className="mt-4">
                    <Card>
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <CardTitulo><span className="capitalize">{tipo}</span></CardTitulo>
                            <div className="flex gap-1 items-center justify-between">
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
                        <div className="overflow-x-auto">
                            <table className="min-w-max w-full table-auto mt-3">
                                <thead> 
                                    <tr className="border-gray-100 border-y  text-sm dark:border-gray-800 text-left">
                                        <th className="py-3 px-4">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">
                                                { tipo === "medicamentos" ? "Principio activo": "Nombre"}
                                            </p>
                                        </th>
                                        {tipo === "medicamentos" ? (<>
                                            <th className="py-3 px-4">
                                                <p className="font-medium text-gray-700 dark:text-gray-400">Forma farmacéutica</p>
                                            </th>
                                            <th className="py-3 px-4">
                                                <p className="font-medium text-gray-700 dark:text-gray-400">Concentración</p>
                                            </th>
                                            <th className="py-3 px-4">
                                                <p className="font-medium text-gray-700 dark:text-gray-400">Presentación</p>
                                            </th>
                                            <th className="py-3 px-4">
                                                <p className="font-medium text-gray-700 dark:text-gray-400">Unidad médica</p>
                                            </th>
                                            <th className="py-3 px-4">
                                                <p className="font-medium text-gray-700 dark:text-gray-400">Stock requerido</p>
                                            </th>
                                        </>):(<>
                                            <th className="py-3 px-4">
                                                <p className="font-medium text-gray-700 dark:text-gray-400">Serie</p>
                                            </th>
                                            <th className="py-3 px-4">
                                                <p className="font-medium text-gray-700 dark:text-gray-400">Presentación comercial</p>
                                            </th>
                                            <th className="py-3 px-4">
                                                <p className="font-medium text-gray-700 dark:text-gray-400">Riesgo</p>
                                            </th>
                                            <th className="py-3 px-4">
                                                <p className="font-medium text-gray-700 dark:text-gray-400">Stock requerido</p>
                                            </th>
                                        </>)}
                                        <th className="py-3 px-4">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Acciones</p>
                                        </th>
                                    </tr>
                                </thead>

                                {loading ? <SkeletonTable rows={7} columns={7}/>: 
                                    <tbody className="divide-y divide-gray-100  text-sm dark:divide-gray-800">
                                        {error ? <tr>
                                            <td colSpan={tipo === "medicamentos" ? 8 : 7} className="py-3">
                                                <p className="text-gray-700 dark:text-gray-400 text-center"> {error}</p>
                                            </td>
                                        </tr> : 
                                        <>
                                            {productos.length === 0 ? 
                                                <tr>
                                                    <td colSpan={tipo === "medicamentos" ? 8 : 7}  className="py-3">
                                                        <p className="text-gray-700 dark:text-gray-400 text-center"> No hay {tipo} por mostrar</p>
                                                    </td>
                                                </tr>: 
                                                <>
                                                    {productos.map(producto => {
                                                        return <tr 
                                                            key={producto.id}
                                                            onClick={() => irAProducto(producto.id)}
                                                            className="cursor-pointer"
                                                        >
                                                            <td className="py-3 px-4">
                                                                <div className="w-full flex items-center gap-3">
                                                                    <img 
                                                                        src={`${host}${producto.avatarThumbnail}`}
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
                                                            </td>
                                                            {tipo === "medicamentos" ? (<>
                                                                <td className="py-3 px-4">
                                                                    <p className="text-gray-700 dark:text-gray-400"> {producto.formaFarmaceutica} </p>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <p className="text-gray-700 dark:text-gray-400"> {producto.concentracion} </p>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <p className="text-gray-700 dark:text-gray-400"> {producto.presentacionComercial} </p>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <p className="text-gray-700 dark:text-gray-400"> {producto.unidadMedida} </p>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <p className="text-gray-700 dark:text-gray-400"> {producto.stockRequerido} </p>
                                                                </td>
                                                            </>):(<>
                                                                <td className="py-3 px-4">
                                                                    <p className="text-gray-700 dark:text-gray-400"> {producto.serie} </p>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <p className="text-gray-700 dark:text-gray-400"> {producto.presentacionComercial} </p>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <p className="text-gray-700 dark:text-gray-400"> {producto.riesgo} </p>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <p className="text-gray-700 dark:text-gray-400"> {producto.stockRequerido} </p>
                                                                </td>
                                                            </>)}
                                                            <td className="py-3 px-4">
                                                                <div className="text-gray-700 dark:text-gray-400 flex gap-2">
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
                                                            </td>
                                                        </tr>
                                                    })}
                                                </>
                                                }
                                            </>}
                                    </tbody>}
                            </table>
                        </div>
                        <Pagination
                            paginaActual={paginaActual}
                            totalPaginas={totalPaginas}
                            onPageChange={setPaginaActual}
                        />
                    </Card>
                </div>
            </Layout>

            {modalActivo === "crear" && almacen && (
                <ModalCrearProducto 
                    cerrarModal={() => setModalActivo(null)}
                    setProductos = {setProductos}
                    tipo = {tipo}
                    almacenId = {almacen.id}
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
                    urlImage = {`${productoSeleccionado.avatar}`}
                    tipo={tipo}
                />
            )}
        </>
    );
}
export default ProductosPagina;