import React, { useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import { dateColombiaFormat } from '../../../../utils/utilities';
import Pagination from '../../../../shared/components/Pagination';
import Button from '../../../../shared/components/Button';
import { LuCalendar, LuRefreshCcw, LuSearch } from 'react-icons/lu';
import DatePicker from 'react-datepicker';

const Movimientos = () => {
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [movimientos, setMovimientos] = useState([]);
    const [modalActivo, setModalActivo] = useState(null);
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);
    const [consulta, setConsulta] = useState("");
    const [fecha, setFecha] = useState();
    const [tipo, setTipo] = useState();
    const [fresh, setRefresh] = useState(1);
    const handleChange = (date) => {
        setFecha(date);
    };

    return (
        <Card>
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
                        <select 
                            value={tipo}
                            onChange={(e) => setTipo(e.currentTarget.value)}
                            className='select-form'
                        >
                            <option value="">Seleccionar tipo...</option>
                            <option value="entrada">Entrada</option>
                            <option value="salida">Salida</option>
                        </select>
                    </div>
                    <div className='relative dark:text-gray-200'>
                        <DatePicker 
                            className='relative input-form w-[190px] px-2 placeholder-gray-700  dark:placeholder-gray-200'
                            selected={fecha} 
                            onChange={handleChange} 
                            dateFormat="yyyy/MM/dd" 
                            placeholderText="Selecciona una fecha..."
                            locale="es"
                        />
                        <LuCalendar className='absolute right-3 top-[14px]' />
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
                                    {movimientos.map((movimiento) => {
                                        return (
                                            <tr 
                                                key={movimiento.id} 
                                                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                                            >
                                                <td className="py-3 px-4 capitalize">
                                                    <div className="items-center flex gap-3 rounded-full">
                                                        <p className="text-gray-700 dark:text-gray-400 text-sm">{movimiento.tipo}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="text-gray-700 dark:text-gray-400">{movimiento.cantidad}</p>
                                                </td>
                                                <td className="py-3 px-4 lg:gap-2 items-center">
                                                    <p className="text-gray-700 dark:text-gray-400">{dateColombiaFormat(movimiento.fecha)}</p>
                                                </td>
                                                <td className="py-3 px-4 items-center">
                                                    <p className="text-gray-700 dark:text-gray-400">{movimiento.descripcion}</p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-gray-700 dark:text-gray-400 flex gap-2">
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
    );
};

export default Movimientos;