import React, { useEffect, useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import Pagination from '../../../../shared/components/Pagination';
import Button from '../../../../shared/components/Button';
import { LuCircleAlert, LuCircleCheck, LuRefreshCcw, LuSearch } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import useDebounce from '../../../../shared/hooks/useDebounce';
import { Tooltip } from 'react-tooltip';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerProductosCorte } from '../../services/productoServices';
import SkeletonTable from '../../../../shared/components/SkeletonTable';
import { host } from '../../../../utils/config';
import imageDefault from "../../../../assets/image-default.png";
import ModalAbrirImagenPerfil from '../../../../shared/components/ModalAbrirImagenPerfil';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productos, setProductos] = useState([]);
    const token = useSelector(state => state.auth.token);
    const [consulta, setConsulta] = useState("");
    const [refresh, setRefresh] = useState(0); 
    const {periodo} = useParams();
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const navigate = useNavigate();
    
    const debouncedConsulta = useDebounce(consulta, 500);
    
    useEffect(() => {
        // Fetch medicamentos
        const fetchProductos = async() => {
            setLoading(true);
            try {
                setError(null);
                const res = await obtenerProductosCorte(token, corteId, tipo, paginaActual, debouncedConsulta);
                setProductos(res.data)
                // setPaginaActual(res.data.paginacion.paginaActual);
                // setTotalPaginas(res.data.paginacion.totalPaginas);
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno");
            } finally{
                setLoading(false);
            }
        }
        if(corteId){
            fetchProductos();
        }
    }, [token, corteId, tipo, paginaActual, refresh, debouncedConsulta]);

    const redireccionarProductoCorte = (productoId) => {
        navigate(`/inventarios/${periodo}/${productoId}`)
    }

    return (<>
        <Card className={`mt-4`}>
            {/* Header */}
            <div className="flex justify-between items-center ">
                <CardTitulo className={`capitalize`}>{tipo}</CardTitulo>
                <div className="flex gap-1 items-center justify-between">
                    <div className="relative hidden md:block">
                        <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                        <input 
                            type="text" 
                            placeholder={`Buscar ${tipo}...`}
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
                        onClick={() => {
                            setPaginaActual(1)
                            setRefresh((prev) => prev + 1)
                        }}
                    >
                        <LuRefreshCcw />
                    </Button>
                </div>
            </div>
        
            <div className="overflow-x-auto mt-3">
                <table className="min-w-full table-auto text-sm">
                    <thead className='border-gray-100 border-y  text-sm dark:border-gray-800 text-left'>
                        <tr className="text-sm">
                            <th className="py-3 px-4">
                                <p className="font-medium text-gray-700 dark:text-gray-400">
                                    {tipo === "medicamentos" ? "Principio activo" : "Nombre"}
                                </p>
                            </th>
                            <th className="py-3 px-4">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Stock inicial</p>
                            </th>
                            <th className="py-3 px-4">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Ingresos</p>
                            </th>
                            <th className="py-3 px-4">
                                <p className="font-medium text-gray-700 dark:text-gray-400">salidas</p>
                            </th>
                            <th className="py-3 px-4">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Stock final</p>
                            </th>
                            <th className="py-3 px-4">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Stock requerido</p>
                            </th>
                            <th className="py-3 px-4 min-w-[120px] hidden">
                                <p className="font-medium text-gray-700 dark:text-gray-400">Pedidos</p>
                            </th>
                        </tr>
                    </thead>
                    {/* Loading */}
                    {loading && (
                        <SkeletonTable rows={7} columns={8}/>
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
                                        key={producto.id}
                                        onClick={() => redireccionarProductoCorte(producto.id)}
                                        className="cursor-pointer"
                                    >
                                        <td className="py-3 px-4">
                                            <div className='flex items-center gap-3'>
                                                <img 
                                                    src={`${host}${producto.avatar}`}
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
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {producto.stockInicial} </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {producto.ingresos} </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {producto.salidas} </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {producto.stockFinal} </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {producto.stockRequerido} </p>
                                        </td>
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