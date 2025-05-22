import { obtenerCorteMovimientosLote, obtenerMovimientosLote } from '../../services/movimientoServices';
import { LuCalendar, LuEraser, LuPencil, LuSearch } from 'react-icons/lu';
import SkeletonTable from '../../../../shared/components/SkeletonTable';
import Pagination from '../../../../shared/components/Pagination';
import CardTitulo from '../../../../shared/components/CardTitulo';
import { dateColombiaFormat } from '../../../../utils/utilities';
import ModalEliminarMovimiento from './ModalEliminarMovimiento';
import useDebounce from '../../../../shared/hooks/useDebounce';
import ModalEditarMovimiento from './ModalEditarMovimiento';
import ModalCrearMovimiento from './ModalCrearMovimiento';
import Button from '../../../../shared/components/Button';
import Card from '../../../../shared/components/Card';
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from 'react';
import "../../../../assets/datePicker.css"
import { useSelector } from 'react-redux';
import { Spanish } from "flatpickr/dist/l10n/es";
import Flatpickr from "react-flatpickr";
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const Movimientos = ({corteId, loteId, setRefreshStock}) => {
    const [movimientos, setMovimientos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);
    const [modalActivo, setModalActivo] = useState(null);
    const [fresh, setRefresh] = useState(1);
    const token = useSelector(state => state.auth.token);
    const [consulta, setConsulta] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fecha, setFecha] = useState([]);
    const [tipo, setTipo] = useState();
    const {periodo} = useParams();
    const debouncedConsulta = useDebounce(consulta, 500);

    // Obtener movimientos del lote en el corte
    useEffect(() => {
        const fetchMovimientosCorte = async (tipoConsulta = "general") => {
            setLoading(true);
            setError(null);
            
            try {
                let respuesta; 
                if(tipoConsulta === "general"){
                    respuesta = await obtenerMovimientosLote(token, loteId, tipo, fecha, paginaActual, debouncedConsulta);
                }else{
                    respuesta = await obtenerCorteMovimientosLote(token, corteId, loteId, tipo, fecha, paginaActual, debouncedConsulta);
                }
                if(respuesta?.data){
                    setMovimientos(respuesta.data)
                    setPaginaActual(respuesta.paginacion.paginaActual);
                    setTotalPaginas(respuesta.paginacion.totalPaginas);
                }
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error al intentar obtener los movimientos.")
            } finally{
                setLoading(false);
            }
        }

        if(loteId && corteId){
            // Obtener movimientos del lote en un corte predeterminado
            fetchMovimientosCorte("no-general");
        }else if(loteId && !corteId){
            // TODO: Obtener movimientos del lote
            fetchMovimientosCorte();
        }
    }, [loteId, corteId, token, debouncedConsulta, paginaActual, fresh, tipo, fecha]);

    useEffect(() => {
        if(setRefreshStock){
            setRefreshStock(prev => prev + 1);
        }
    }, [movimientos, setRefreshStock]);

    return (
        <>  
            <Card className={`col-span-12 xl:col-span-8 2xl:col-span-8 h-full flex flex-col`}>
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
                        <div className="relative hidden">
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
                        {/* Tipo de movimiento */}
                        <div className="relative hidden md:block">
                            <select 
                                value={tipo}
                                onChange={(e) => setTipo(e.currentTarget.value)}
                                className='select-form'
                            >
                                <option value="">Seleccionar...</option>
                                <option value="entrada">Entrada</option>
                                <option value="salida">Salida</option>
                            </select>
                        </div>
                        <div className="relative">
                            <LuCalendar className="absolute top-[14px] left-4 text-gray-600 dark:text-gray-500"/>
                            <Flatpickr
                                options={{
                                    mode: "single",
                                    dateFormat: "Y-m-d", 
                                    altInput: true,
                                    altFormat: "j \\d\\e F \\d\\e Y", // j = día sin 0, F = mes nombre completo, \\d\\e para texto literal "de"
                                    locale: Spanish,
                                    minDate: periodo ? `${periodo}-01`: "",
                                    maxDate: periodo ? `${periodo}-31`: "",
                                }}
                                onClose={(fechaSeleccionada) => {
                                    const fechaInicio = fechaSeleccionada?.[0];
                                    if (fechaInicio) {
                                        setFecha(format(fechaInicio, "yyyy-MM-dd"));
                                    }
                                }}
                                placeholder="Seleccione una fecha"
                                className="input-form shadow pl-10"
                                value={fecha}
                            />
                        </div>
                    </div>
                </div>

                <div className="min-w-0 flex-grow mt-4">
                    <div className="overflow-x-auto w-full max-h-[320px] overflow-y-auto custom-scrollbar ">
                        <table className="mt-3 min-w-full">
                            <thead className='sticky top-0'>
                                <tr className="border-gray-100 border-y text-xs dark:border-gray-800 text-left bg-white dark:bg-gray-800">
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Tipo</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Cantidad</p>
                                    </th>
                                    <th className="py-3 px-4 min-w-[120px]">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Fecha</p>
                                    </th>
                                    <th className="py-3 px-4 min-w-[200px]">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Descripción</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Acciones</p>
                                    </th>
                                </tr>
                            </thead>
                            {loading && <SkeletonTable rows={7} columns={5}/>}
                            <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800 text-gray-700 dark:text-gray-400">
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
                                        {movimientos.map((movimiento) => {
                                            return (
                                                <tr 
                                                    key={movimiento.id} 
                                                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                                                >
                                                    <td className="py-3 px-4 capitalize">
                                                        <div className="items-center flex gap-3 rounded-full">
                                                            <p>{movimiento.tipo}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <p>{movimiento.cantidad}</p>
                                                    </td>
                                                    <td className="py-3 px-4 lg:gap-2 items-center">
                                                        <p>{dateColombiaFormat(movimiento.fecha)}</p>
                                                    </td>
                                                    <td className="py-3 px-4 items-center">
                                                        <p>{movimiento.descripcion}</p>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex gap-2">
                                                            <button 
                                                                className="cursor-pointer p-1"
                                                                title="Editar movimiento"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setModalActivo("editar"); 
                                                                    setMovimientoSeleccionado(movimiento);
                                                                }}    
                                                            >
                                                                <LuPencil />
                                                            </button>
                                                            <button 
                                                                className="cursor-pointer p-1"
                                                                title="Eliminar movimiento"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); 
                                                                    setModalActivo("eliminar"); 
                                                                    setMovimientoSeleccionado(movimiento);
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
                    cerrarModal = {() => setModalActivo(null) }
                    setMovimientos = {setMovimientos}
                />
            </>)}

            {modalActivo === "editar" && (<>
                <ModalEditarMovimiento 
                    cerrarModal = {() => setModalActivo(null) }
                    movimientoSeleccionado = {movimientoSeleccionado}
                    setMovimientoSeleccionado = {setMovimientoSeleccionado}
                    setMovimientos = {setMovimientos}
                />
            </>)}
            
            {modalActivo === "eliminar" && (<>
                <ModalEliminarMovimiento 
                    cerrarModal = {() => setModalActivo(null) }
                    movimientoSeleccionado = {movimientoSeleccionado}
                    setMovimientoSeleccionado = {setMovimientoSeleccionado}
                    setMovimientos = {setMovimientos}
                />
            </>)}
        </>
    );
};

export default Movimientos;