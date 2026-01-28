import React, { useEffect, useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import Pagination from '../../../../shared/components/Pagination';
import { LuBarcode, LuChevronDown, LuCircleAlert, LuCircleCheck, LuEraser, LuPencil, LuRefreshCcw, LuSearch } from 'react-icons/lu';
import useDebounce from '../../../../shared/hooks/useDebounce';
import { Tooltip } from 'react-tooltip';
import { useNavigate, useParams } from 'react-router-dom';
import SkeletonTable from '../../../../shared/components/SkeletonTable';
import { host } from '../../../../utils/config';
import imageDefault from "../../../../assets/images/image-default.png";
import ModalAbrirImagenPerfil from '../../../../shared/components/ModalAbrirImagenPerfil';
import { obtenerTodasCategorias } from '@/pages/productos/services/categoriaServices';
import ModalMostrarCodigoBarras from '@/pages/productos/components/productos/ModalMostrarCodigoBarras';
import { obtenerProductosCorte } from '../../services/productosServices';

// Componente para mostrar el estado del stock
const StockStatus = ({ stockRequerido, stockFinal }) => {
    const cantidadApedir = stockFinal- stockRequerido;
  
    // Función que genera el estilo y el mensaje según el estado
    const renderStockStatus = () => {
        if (cantidadApedir < 0) {
            return {
                text: `${-cantidadApedir} unidades por debajo del nivel requerido`,
                bgColor: 'bg-red-200 dark:bg-gray-900',
                textColor: 'text-red-600',
                icon: <LuCircleAlert className="inline-block relative -top-[2px] ml-1" />,
                cantidad: -cantidadApedir
            };
        }
    
        return {
            text: `${cantidadApedir === 0 ? "Stock justo al nivel requerido." : `${cantidadApedir} unidades por encima del nivel requerido`}`,
            bgColor: 'bg-green-200 dark:bg-gray-900',
            textColor: 'text-green-800',
            icon: <LuCircleCheck className="inline-block relative -top-[2px] ml-1" />,
            cantidad: cantidadApedir
        };
    }
  
    const { text, bgColor, textColor, icon, cantidad } = renderStockStatus();
  
    return (
      <span
        className={`inline-block dark:text-gray-400 ${bgColor} ${textColor} py-2 px-3 text-xs rounded-2xl`}
        data-tooltip-id="guardar"
        data-tooltip-content={text}
        aria-label={text}
      >
        <span className="inline-block">{cantidad}</span>
        {icon}
      </span>
    );
};

const Productos = ({ tipo, corteId }) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [modalActivo, setModalActivo] = useState("");
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productos, setProductos] = useState([]);
    const [consulta, setConsulta] = useState("");
    const navigate = useNavigate();
    const debouncedConsulta = useDebounce(consulta, 500);
    
    useEffect(() => {
        // Fetch medicamentos
        const fetchProductos = async() => {
            setLoading(true);
            try {
                setError(null);
                const res = await obtenerProductosCorte(corteId, tipo, paginaActual, debouncedConsulta, categoriaSeleccionada);
                setProductos(res.data)
                setPaginaActual(res.paginacion.paginaActual);
                setTotalPaginas(res.paginacion.totalPaginas);
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno");
            } finally{
                setLoading(false);
            }
        }
        if(corteId){
            fetchProductos();
        }
    }, [corteId, tipo, paginaActual, debouncedConsulta, categoriaSeleccionada]);

    const redireccionarProductoCorte = (tipo, corteId, productoId) => {
        navigate(`/inventarios/${tipo}/${corteId}/${productoId}/producto`)
    }

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

    return (<>
        <Card className={`mb-6`}>
            {/* Header */}
            <div className="flex justify-between items-center ">
                <CardTitulo className={`capitalize`}>{tipo}</CardTitulo>
                <div className="flex gap-1 items-center justify-between">
                    <div className="relative hidden md:block flex-1">
                        <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                        <input
                            type="text"
                            placeholder={`Buscar ${tipo} por nombre o código...`}
                            className="input-form pl-10 dark:bg-gray-900 dark:text-white w-full"
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

                    {/* 🧾 Selector de categoría */}
                    <div className="relative">
                        <select
                            className="select-form text-gray-600 dark:text-gray-500"
                            value={categoriaSeleccionada}
                            onChange={(e) => setCategoriaSeleccionada(e.currentTarget.value)}
                        >
                        <option value="">Seleccionar categoría...</option>
                            {categorias.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                                </option>
                            ))}
                        </select>
                        <LuChevronDown className="absolute top-[16px] right-2 dark:text-gray-200" />
                    </div>
                </div>
            </div>
        
            <div className="overflow-x-auto">
                <table className="min-w-max w-full mt-3">
                    <thead className='sticky top-0 bg-white dark:bg-gray-800 border-gray-100 border-y text-sm dark:border-gray-800'>
                        <tr className="text-left">
                            <th className="py-3 px-4">
                                <p className="font-medium text-gray-700 dark:text-gray-400">
                                    {tipo === "medicamentos" ? "Principio activo" : "Nombre"}
                                </p>
                            </th>
                            <th className='py-3 px-4'>
                                <p className="font-medium text-gray-700 dark:text-gray-400">Cód. barras</p>
                            </th>
                            <th className="py-3 px-4">
                                <p className="font-medium text-gray-700 dark:text-gray-400">
                                    Categoría
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
                            </>)}
                        </tr>
                    </thead>
                    {/* Loading */}
                    {loading && (
                        <SkeletonTable rows={7} columns={tipo === "medicamentos" ? 7 : 6}/>
                    )}

                    <tbody className='divide-y divide-gray-100  text-sm dark:divide-gray-800'>
                        {/* Mostrar error */}
                        {!loading && error && (
                            <tr>
                                <td colSpan="8" className="py-3">
                                    <p className="text-gray-700 dark:text-gray-400 text-center">{error}</p>
                                </td>
                            </tr>
                        )}
                        {!loading && !error && productos.length === 0 && (
                            <tr>
                                <td colSpan="8" className="py-3">
                                    <p className="text-gray-700 dark:text-gray-400 text-center"> No hay {tipo} por mostrar en este corte</p>
                                </td>
                            </tr>
                        )}
                        {!loading && !error && productos.length > 0 && (
                            <>
                                {productos.map(producto => {
                                    return <tr 
                                        key={producto.productoId}
                                        onClick={() => redireccionarProductoCorte(tipo, corteId, producto.productoId)}
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
                                        <td className='py-3 px-4'>
                                            <button
                                                className='cursor-pointer ml-2 p-1 rounded-[2px] bg-gray-700 text-white'
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    setModalActivo("codigo-barra");
                                                    setProductoSeleccionado(producto)
                                                }}
                                            >
                                                <LuBarcode />
                                            </button>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {producto?.categoriaNombre ?? "---"} </p>
                                        </td>
                                        {tipo === "medicamentos" ? (<>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400"> {producto.formaFarmaceutica ?? "---" } </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400"> {producto.concentracion ?? "---"} </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400"> {producto.presentacionComercial ?? "---"} </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400"> {producto.unidadMedida ?? "---"} </p>
                                            </td>
                                        
                                        </>):(<>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400"> {producto.serie ?? "---"} </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400"> {producto.presentacionComercial ?? "---"} </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400"> {producto.riesgo ?? "---"} </p>
                                            </td>
                                        </>)}
                                    </tr>
                                })}
                            </>
                        )}
                    </tbody>
                </table>
                <Tooltip id="guardar" place="top" effect="solid" className="z-50 max-w-[250px]" />
            </div>
            <Pagination
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onPageChange={setPaginaActual}
            />
        </Card>
        
        {modalActivo === "codigo-barra" && (
            <ModalMostrarCodigoBarras 
                cerrarModal={() => setModalActivo(null)}
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
};

export default Productos;