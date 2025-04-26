import React, { useEffect, useState } from 'react';
import Pagination from '../../../../shared/components/Pagination';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import Button from '../../../../shared/components/Button';
import { LuRefreshCcw, LuSearch } from 'react-icons/lu';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { obtenerCorteMovimientosLote } from '../../services/cortesServices';
import { useSelector } from 'react-redux';
import useDebounce from '../../../../shared/hooks/useDebounce';
import ModalCrearMovimiento from './ModalCrearMovimiento';

const Movimientos = ({ lote, corteSeleccionado }) => {
    const [movimientos, setMovimientos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [modalActivo, setModalActivo] = useState(null);
    const [fresh, setRefresh] = useState(1);
    const token = useSelector(state => state.auth.token);
    const [consulta, setConsulta] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState();

    const handleChange = (date) => {
        setStartDate(date);
    };
    const debouncedConsulta = useDebounce(consulta, 500);
    
    // Obtener movimientos del lote en el corte
    useEffect(() => {
        const fetchMovimientos = async () => {
            setLoading(true);
            setError(null);
            try {
                const respuesta = await obtenerCorteMovimientosLote(token, corteSeleccionado.id, lote.id, paginaActual, debouncedConsulta);
                if(respuesta?.data){
                    setMovimientos(respuesta.data)
                }
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error al intentar obtener los movimientos.")
            } finally{
                setLoading(false);
            }
        }
        if(lote && corteSeleccionado){
            fetchMovimientos();
        }
    }, [lote, corteSeleccionado, token, debouncedConsulta, paginaActual, fresh]);
    
    return (
        <>  
            <Card className={`col-span-12 xl:col-span-8 2xl:col-span-8 `}>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <CardTitulo>Movimientos</CardTitulo>
                    <div className="flex gap-1 items-center justify-between">
                        <Button
                            type="button"
                            colorButton="primary"
                            onClick={() => {
                                setModalActivo("crear")
                            }}
                        >   
                            Crear
                        </Button>
                        {/* Buscar en movimientos */}
                        <div className="relative hidden ">
                            <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                            <input 
                                type="text" 
                                placeholder="Buscar en movimientos..." 
                                className="input-form pl-10 dark:bg-gray-900"
                                value={consulta}
                                onChange={(e) => {
                                    setConsulta(e.currentTarget.value);
                                }}
                            />
                        </div>
                        {/* Tipo de movimiento */}
                        <div className="relative hidden md:block">
                            <select name="" id="" className='select-form'>
                                <option value="">Seleccionar tipo...</option>
                                <option value="entrada">Entrada</option>
                                <option value="salida">Salida</option>
                            </select>
                        </div>
                        <div>
                            <DatePicker 
                                className='relative select-form w-[170px] px-2'
                                selected={startDate} 
                                onChange={handleChange} 
                                dateFormat="yyyy/MM/dd" 
                                placeholderText="Selecciona una fecha..."
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

                <div className="min-w-0">
                    <div className="overflow-x-auto w-full">
                        <table className="mt-3 min-w-full">
                            <thead>
                                <tr className="border-gray-100 border-y text-sm dark:border-gray-800 text-left">
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Tipo</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Cantidad</p>
                                    </th>
                                    <th className="py-3 px-4 min-w-[120px]">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Fecha</p>
                                    </th>
                                    <th className="py-3 px-4 min-w-[120px]">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Descripción</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Acciones</p>
                                    </th>
                                </tr>
                            </thead>
                            {loading && <SkeletonTable rows={7} columns={5}/>}
                            <tbody className="divide-y divide-gray-100  text-sm dark:divide-gray-800">
                                {/* Display error */}
                                {!loading && error && (<tr>
                                        <td colSpan="5" className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400 text-center"> {error}</p>
                                        </td>
                                    </tr>)
                                }

                                {/* No hay lotes por mostrar */}
                                {!loading && !error && movimientos.length === 0 && (<tr>
                                        <td colSpan="6" className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400 text-center"> No hay movimientos por mostrar</p>
                                        </td>
                                    </tr>
                                )}

                                {!loading && !error && movimientos.length > 0 && (
                                    <>
                                        {movimientos.map((movimientos) => {
                                            return (
                                                <tr 
                                                    key={movimientos.id} 
                                                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                                                >
                                                    <td className="py-3 px-4 capitalize">
                                                        <div className="items-center flex gap-3 rounded-full">
                                                            <p className="text-gray-700 dark:text-gray-400 text-sm">{movimientos.tipo}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <p className="text-gray-700 dark:text-gray-400">{movimientos.cantidad}</p>
                                                    </td>
                                                    <td className="py-3 px-4 lg:gap-2 items-center">
                                                        <p className="text-gray-700 dark:text-gray-400">{movimientos.fecha}</p>
                                                    </td>
                                                    <td className="py-3 px-4 items-center">
                                                        <p className="text-gray-700 dark:text-gray-400">{movimientos.descripcion}</p>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="text-gray-700 dark:text-gray-400 flex gap-2">
                                                            <button 
                                                                className="cursor-pointer p-1"
                                                                title="Editar movimiento"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // evita que se dispare el onClick del <tr>
                                                                    // setModalActivo("editar"); 
                                                                    // setMedicamentoSeleccionado(medicamento);
                                                                }}    
                                                            >
                                                                <LuPencil />
                                                            </button>
                                                            <button 
                                                                className="cursor-pointer p-1"
                                                                title="Eliminar movimiento"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // evita que se dispare el onClick del <tr>
                                                                    // setModalActivo("eliminar"); 
                                                                    // setMedicamentoSeleccionado(medi  camento);
                                                                }} 
                                                            >
                                                                <LuEraser />
                                                            </button> 
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onPageChange={setPaginaActual}
                />
            </Card>
            {modalActivo === "crear" && (<>
                <ModalCrearMovimiento 
                    corteSeleccionado = {corteSeleccionado}
                    lote = {lote}
                    cerrarModal = {() => setModalActivo(null) }
                />
            </>
            )}
        </>
    );
};

export default Movimientos;