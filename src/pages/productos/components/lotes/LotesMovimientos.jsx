import SkeletonTable from '../../../../shared/components/SkeletonTable';
import Pagination from '../../../../shared/components/Pagination';
import CardTitulo from '../../../../shared/components/CardTitulo';
import { dateColombiaFormat, formatCantidad, formatFechaCorte } from '../../../../utils/utilities';
import useDebounce from '../../../../shared/hooks/useDebounce';
import Card from '../../../../shared/components/Card';
import { LuEraser, LuPencil, LuSearch } from 'react-icons/lu';
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from 'react';
import "../../../../assets/datePicker.css"
import { obtenerMovimientosLotes } from '../../services/movimientoServices';
import TableThead from '@/shared/components/TableThead';
import TableTr from '@/shared/components/TableTr';
import Table from '@/shared/components/Table';
import TableTd from '@/shared/components/TableTd';
import TableTbody from '@/shared/components/TableTbody';
import Button from '@/shared/components/Button';
import ModalCrearMovimientos from '../movimientos/ModalCrearMovimientos';
import ModalEditarMovimientos from '../movimientos/ModalEditarMovimientos';
import ModalEliminarMovimientos from '../movimientos/ModalEliminarMovimientos';
import TableTh from '@/shared/components/TableTh';

const LotesMovimientos = ({ loteId, updateRefresh}) => {
    const [movimientos, setMovimientos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [consulta, setConsulta] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fecha, setFecha] = useState("");
    const [tipo, setTipo] = useState("");
    const debouncedConsulta = useDebounce(consulta, 500);
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState();
    const [modalActivo, setModalActivo] = useState();

    useEffect(() => {
        const fetchMovimientos = async () => {
            setLoading(true);
            setError(null);
            try {
                const respuesta = await obtenerMovimientosLotes(loteId, tipo, fecha, paginaActual, debouncedConsulta);
                setMovimientos(respuesta.data);
                setPaginaActual(respuesta.paginacion.paginaActual);
                setTotalPaginas(respuesta.paginacion.totalPaginas);
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error al intentar obtener los movimientos.");
            } finally {
                setLoading(false);
            }
        };
        fetchMovimientos();
    }, [ loteId, debouncedConsulta, paginaActual, tipo, fecha]);

    return (
        <>  
            <Card>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <CardTitulo>Movimientos</CardTitulo>

                    <div className="flex gap-1 items-center justify-between">
                        <Button
                            onClick={() => setModalActivo("crear-movimiento")}
                            colorButton={`primary`}
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
                        <div className="">
                            <input 
                                type="date" 
                                className='select-form'
                                onChange = {(e) => setFecha(e.currentTarget.value)}
                                value = {fecha}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mt-4">
                    <Table>
                        <TableThead>
                            <TableTr>
                                <TableTh>Fecha</TableTh>
                                <TableTh>Tipo</TableTh>
                                <TableTh>Cantidad</TableTh>
                                <TableTh>Descripción</TableTh>
                                <TableTh>Acciones</TableTh>
                            </TableTr>
                        </TableThead>

                        {loading && <SkeletonTable rows={7} columns={5}/>}

                        <TableTbody>

                            {!loading && error && (<TableTr>
                                <TableTd colSpan={5}>{error}</TableTd>
                            </TableTr>)}

                            {!loading && !error && movimientos.length === 0 && (<TableTr>
                                <TableTd colSpan={5}>No hay movimientos por mostrar</TableTd>
                            </TableTr>)}

                            {!loading && !error && movimientos.length > 0 && movimientos.map(movimiento => (
                                <TableTr key={movimiento.id} className="text-sm">
                                    <TableTd>
                                        {dateColombiaFormat(movimiento.fecha)}
                                    </TableTd>
                                    <TableTd className='capitalize'>{movimiento.tipo}</TableTd>
                                    <TableTd>{formatCantidad(movimiento.cantidad)}</TableTd>
                                    <TableTd>{movimiento.descripcion || "---"}</TableTd>
                                    <TableTd>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="cursor-pointer p-1"
                                                title="Editar movimiento"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalActivo("editar-movimiento");
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
                                                    setMovimientoSeleccionado(movimiento);
                                                    setModalActivo("eliminar-movimiento");
                                                }}
                                            >
                                                <LuEraser />
                                            </button>
                                        </div>
                                    </TableTd>
                                </TableTr>
                            ))}

                        </TableTbody>
                    </Table>
                </div>

                <Pagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onPageChange={setPaginaActual}
                />
            </Card>

            {modalActivo === "crear-movimiento" && (
                <ModalCrearMovimientos 
                    setMovimientos = {setMovimientos}
                    cerrarModal = {() => setModalActivo(null)}
                    updateRefresh= { updateRefresh }
                />
            )}

            {modalActivo === "editar-movimiento" && (
                <ModalEditarMovimientos 
                    setMovimientos = {setMovimientos}
                    movimientoSeleccionado = {movimientoSeleccionado}
                    cerrarModal = {() => setModalActivo(null)}
                    updateRefresh = { updateRefresh }
                />
            )}

            {modalActivo === "eliminar-movimiento" && (
                <ModalEliminarMovimientos
                    setMovimientos = {setMovimientos}
                    movimientoSeleccionado = {movimientoSeleccionado}
                    cerrarModal = {() => setModalActivo(null)}
                    updateRefresh = { updateRefresh }
                />
            )}
        </>
    );
};

export default LotesMovimientos;
