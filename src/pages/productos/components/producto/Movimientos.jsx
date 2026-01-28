import { obtenerMovimientosProducto } from '../../services/movimientoServices1';
import SkeletonTable from '../../../../shared/components/SkeletonTable';
import Pagination from '../../../../shared/components/Pagination';
import CardTitulo from '../../../../shared/components/CardTitulo';
import { formatFechaCorte } from '../../../../utils/utilities';
import useDebounce from '../../../../shared/hooks/useDebounce';
import { LuCalendar, LuSearch } from 'react-icons/lu';
import Card from '../../../../shared/components/Card';
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from 'react';
import { Spanish } from "flatpickr/dist/l10n/es";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../../../../assets/datePicker.css"
import Flatpickr from "react-flatpickr";
import { format } from 'date-fns';

const Movimientos = ({ productoId }) => {
    const [movimientos, setMovimientos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const token = useSelector(state => state.auth.token);
    const [consulta, setConsulta] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fecha, setFecha] = useState(null);
    const [tipo, setTipo] = useState("");
    const { periodo } = useParams();
    const debouncedConsulta = useDebounce(consulta, 500);

    useEffect(() => {
        const fetchMovimientos = async () => {
            setLoading(true);
            setError(null);

            try {
                const respuesta = await obtenerMovimientosProducto(token, productoId, tipo, fecha, paginaActual, debouncedConsulta);
                if (respuesta?.data) {
                    setMovimientos(respuesta.data);
                    setPaginaActual(respuesta.paginacion.paginaActual);
                    setTotalPaginas(respuesta.paginacion.totalPaginas);
                }
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error al intentar obtener los movimientos.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovimientos();
    }, [productoId, token, debouncedConsulta, paginaActual, tipo, fecha]);

    return (
        <>  
            <Card>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <CardTitulo>Movimientos</CardTitulo>
                    <div className="flex gap-1 items-center justify-between">
                        {/* Buscar en movimientos */}
                        <div className="relative hidden">
                            <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                            <input 
                                type="text" 
                                placeholder="Buscar..." 
                                className="input-form pl-10 dark:bg-gray-900"
                                value={consulta}
                                onChange={e => setConsulta(e.currentTarget.value)}
                            />
                        </div>

                        {/* Tipo de movimiento */}
                        <div className="relative hidden md:block">
                            <select 
                                value={tipo}
                                onChange={e => setTipo(e.currentTarget.value)}
                                className='select-form'
                            >
                                <option value="">Seleccionar...</option>
                                <option value="entrada">Entrada</option>
                                <option value="salida">Salida</option>
                            </select>
                        </div>

                        {/* Selector de fecha */}
                        <div className="relative hidden sm:block">
                            <LuCalendar className="absolute top-[14px] left-4 text-gray-600 dark:text-gray-500"/>
                            <Flatpickr
                                options={{
                                    mode: "single",
                                    dateFormat: "Y-m-d", 
                                    altInput: true,
                                    altFormat: "j \\d\\e F \\d\\e Y",
                                    locale: Spanish,
                                    minDate: periodo ? `${periodo}-01` : "",
                                    maxDate: periodo ? `${periodo}-31` : "",
                                }}
                                onClose={fechaSeleccionada => {
                                    const fechaInicio = fechaSeleccionada?.[0];
                                    if (fechaInicio) {
                                        setFecha(format(fechaInicio, "yyyy-MM-dd"));
                                    } else {
                                        setFecha(null);
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
                        <table className="mt-3 min-w-max w-full">
                            <thead className='sticky top-0 bg-white dark:bg-gray-800 border-gray-100 border-y text-sm dark:border-gray-800'>
                                <tr className=" text-left">
                                    <th className="py-3 px-4 min-w-[120px]">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Fecha</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Número lote</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Tipo</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Cantidad</p>
                                    </th>
                                    <th className="py-3 px-4">
                                        <p className="font-medium text-gray-700 dark:text-gray-400">Descripción</p>
                                    </th>
                                </tr>
                            </thead>

                            {loading && <SkeletonTable rows={7} columns={5}/>}

                            <tbody className="divide-y divide-gray-100 text-sm dark:divide-gray-800 text-gray-700 dark:text-gray-400">
                                {!loading && error && (
                                    <tr>
                                        <td colSpan="5" className="py-3 px-4">
                                            <p className="text-center">{error}</p>
                                        </td>
                                    </tr>
                                )}

                                {!loading && !error && movimientos.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-3 px-4">
                                            <p className="text-center">No hay movimientos por mostrar</p>
                                        </td>
                                    </tr>
                                )}

                                {!loading && !error && movimientos.length > 0 && movimientos.map(movimiento => (
                                    <tr key={movimiento.id} className="text-sm">
                                        <td className="py-3 px-4 lg:gap-2 items-center">
                                            <p>{formatFechaCorte(movimiento.fecha)}</p>
                                        </td>
                                        <td 
                                            className="py-3 px-4 capitalize"
                                        >
                                            <p>{movimiento.numeroLote}</p>
                                        </td>
                                        <td className="py-3 px-4 capitalize">
                                            <p>{movimiento.tipo}</p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p>{movimiento.cantidad}</p>
                                        </td>
                                        <td className="py-3 px-4 items-center">
                                            <p>{movimiento.descripcion || "N/A"}</p>
                                        </td>
                                    </tr>
                                ))}
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
        </>
    );
};

export default Movimientos;
