import React, { useEffect, useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import Pagination from '../../../../shared/components/Pagination';
import Button from '../../../../shared/components/Button';
import { LuCircleAlert, LuCircleCheck, LuRefreshCcw, LuSearch } from 'react-icons/lu';
import { obtenerCorteActivoMedicamentos } from '../../services/CorteMedicamentoServices';
import { useSelector } from 'react-redux';
import useDebounce from '../../../../shared/hooks/useDebounce';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';

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

const CorteMedicamentos = ({corteSeleccionado}) => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fecha, setFecha] = useState(new Date());
    const token = useSelector(state => state.auth.token);
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const [consulta, setConsulta] = useState("");
    const debouncedConsulta = useDebounce(consulta, 500);
    const [refresh, setRefresh] = useState(0); 
    const navigate = useNavigate();

    const [medicamentos, setMedicamentos] = useState([
        {
            id: 1, 
            nombre: "Adrenalina", 
            formaFarmaceutica: "Solución inyectable",
            concentracion: "1mg/ml", 
            presentacionComercial: "Ampolla", 
            unidadMedida: "mg/ml", 
            stockRequerido: 25, 
            stockInicial: 100,
            ingresos: 25, 
            salidas: 80,
            stockFinal: 45, 
        },
        {
            id: 2,
            nombre: "Paracetamol",
            formaFarmaceutica: "Tableta",
            concentracion: "500mg",
            presentacionComercial: "Caja x 20",
            unidadMedida: "mg",
            stockRequerido: 200,
            stockInicial: 150,
            ingresos: 50,
            salidas: 100,
            stockFinal: 100,
        },
        {
            id: 3,
            nombre: "Ibuprofeno",
            formaFarmaceutica: "Cápsula",
            concentracion: "200mg",
            presentacionComercial: "Frasco x 100",
            unidadMedida: "mg",
            stockRequerido: 300,
            stockInicial: 250,
            ingresos: 30,
            salidas: 70,
            stockFinal: 210,
        },
        {
            id: 4,
            nombre: "Amoxicilina",
            formaFarmaceutica: "Suspensión",
            concentracion: "250mg/5ml",
            presentacionComercial: "Frasco x 60ml",
            unidadMedida: "mg/ml",
            stockRequerido: 80,
            stockInicial: 60,
            ingresos: 40,
            salidas: 30,
            stockFinal: 70,
        },
        {
            id: 5,
            nombre: "Metformina",
            formaFarmaceutica: "Tableta",
            concentracion: "850mg",
            presentacionComercial: "Caja x 30",
            unidadMedida: "mg",
            stockRequerido: 500,
            stockInicial: 400,
            ingresos: 100,
            salidas: 150,
            stockFinal: 350,
        },
        {
            id: 6,
            nombre: "Loratadina",
            formaFarmaceutica: "Jarabe",
            concentracion: "1mg/ml",
            presentacionComercial: "Frasco x 100ml",
            unidadMedida: "mg/ml",
            stockRequerido: 40,
            stockInicial: 30,
            ingresos: 20,
            salidas: 10,
            stockFinal: 40,
        },
        {
            id: 7,
            nombre: "Omeprazol",
            formaFarmaceutica: "Cápsula",
            concentracion: "20mg",
            presentacionComercial: "Caja x 14",
            unidadMedida: "mg",
            stockRequerido: 120,
            stockInicial: 100,
            ingresos: 40,
            salidas: 60,
            stockFinal: 80,
        }
    ]);
    
    useEffect(() => {
        // Fetch medicamentos
        const fetchMedicamentos = async() => {
            try {
                setError(null);
                // const res = await obtenerCorteActivoMedicamentos(token, almacenId, paginaActual, debouncedConsulta);
            } catch (error) {
                // setError(error?.response?.data?.message || "Ha ocurrido un error interno");
            }
        }
        if(almacenId){
            fetchMedicamentos();
        }
    }, [almacenId, paginaActual, refresh, debouncedConsulta]);

    const redireccionarProductoCorte = (corteId, productoId) => {
        navigate(`/inventarios/${corteId}/${productoId}`)
    }

    return (<>
        {!loading && error && (
            <p className="text-gray-700 dark:text-gray-400 text-center my-10 text-sm">{error}</p>
        )}
        {!loading && !error && (
            <Card>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <CardTitulo>Medicamentos</CardTitulo>
                    <div className="flex gap-1 items-center justify-between">
                        <div className="relative hidden md:block">
                            <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                            <input 
                                type="text" 
                                placeholder="Buscar medicamento..." 
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
                            <tr className="text-sm text-left">
                                <th className="w-[70px]"></th>
                                <th className="py-3 pl-1 pr-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Principio activo</p>
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
                                <th className="py-3 px-4 min-w-[120px]">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Pedidos</p>
                                </th>
                            </tr>
                        </thead>
                        {loading && (
                            <SkeletonTable rows={7} columns={8}/>
                        )}
                        <tbody className='divide-y divide-gray-100  text-sm dark:divide-gray-800'>
                            {!loading && !error && medicamentos.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="py-3">
                                        <p className="text-gray-700 dark:text-gray-400 text-center"> No hay medicamentos por mostrar en este corte</p>
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && medicamentos.length > 0 && (
                            <>
                                {medicamentos.map(medicamento => {
                                    return <tr 
                                        key={medicamento.id}
                                        onClick={() => redireccionarProductoCorte(medicamento.id, corteSeleccionado.id)}
                                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <img 
                                                src={`https://picsum.photos/100?${Math.random()}`}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    // e.target.src = imageDefault; 
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // setModalActivo("imagen-perfil");
                                                    // setMedicamentoSeleccionado(medicamento);
                                                }}
                                                alt="Perfil" 
                                                className="w-8 h-8 block object-cover rounded-full select-none cursor-pointer"  
                                            />
                                        </td>
                                        <td className="py-3 pl-1 pr-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {medicamento.nombre}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {medicamento.stockInicial} </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {medicamento.ingresos} </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {medicamento.salidas} </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {medicamento.stockFinal} </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {medicamento.stockRequerido} </p>
                                        </td>
                                        <td className="py-3 px-4 text-xs flex">
                                            <StockStatus stockRequerido={medicamento.stockRequerido} stockFinal={medicamento.stockFinal} />
                                        </td>
                                    </tr>
                                })}
                            </>
                            )}
                            <Tooltip id="guardar" place="top" effect="solid" className="z-50 max-w-[250px]" />
                        </tbody>
                    </table>
                </div>
                <Pagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onPageChange={setPaginaActual}
                />
            </Card>
        )}
    </>
    );
};

export default CorteMedicamentos;