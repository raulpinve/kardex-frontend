import SkeletonTable from '../../../../shared/components/SkeletonTable';
import Pagination from '../../../../shared/components/Pagination';
import CardTitulo from '../../../../shared/components/CardTitulo';
import { formatCantidad, formatFechaCorte } from '../../../../utils/utilities';
import useDebounce from '../../../../shared/hooks/useDebounce';
import { LuEraser, LuPencil, LuSearch } from 'react-icons/lu';
import Card from '../../../../shared/components/Card';
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../../../../assets/datePicker.css"
import Table from '@/shared/components/Table';
import TableThead from '@/shared/components/TableThead';
import TableTr from '@/shared/components/TableTr';
import TableTh from '@/shared/components/TableTh';
import TableTd from '@/shared/components/TableTd';
import TableTbody from '@/shared/components/TableTbody';
import { obtenerMovimientosProductos } from '../../services/movimientoServices';
import ModalEditarMovimientos from '../movimientos/ModalEditarMovimientos';
import ModalEliminarMovimientos from '../movimientos/ModalEliminarMovimientos';

const ProductosMovimientos = ({ refresh , updateRefresh}) => {
    const [movimientos, setMovimientos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fecha, setFecha] = useState("");
    const [tipo, setTipo] = useState("");
    const { productoId } = useParams();
    const [consulta, setConsulta] = useState("");
    const debouncedConsulta = useDebounce(consulta, 500);
    const [modalActivo, setModalActivo] = useState();
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState();

    useEffect(() => {
        const fetchMovimientos = async () => {
            setLoading(true);
            setError(null);
            try {
                const respuesta = await obtenerMovimientosProductos(productoId, tipo, fecha, paginaActual, debouncedConsulta);
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
    }, [ productoId, debouncedConsulta, paginaActual, tipo, fecha, refresh]);

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
                                <TableTh>Lote</TableTh>
                                <TableTh>Tipo</TableTh>
                                <TableTh>Cantidad</TableTh>
                                <TableTh>Descripción</TableTh>
                                <TableTh>Acciones</TableTh>
                            </TableTr>
                        </TableThead>

                        {loading && <SkeletonTable rows={7} columns={6}/>}

                        <TableTbody>

                            {!loading && error && (<TableTr>
                                <TableTd colSpan={6}>{error}</TableTd>
                            </TableTr>)}

                            {!loading && !error && movimientos.length === 0 && (<TableTr>
                                <TableTd colSpan={6}>
                                    No hay movimientos por mostrar
                                </TableTd>
                            </TableTr>)}

                            {!loading && !error && movimientos.length > 0 && movimientos.map(movimiento => (
                                <TableTr key={movimiento.id} className="text-sm">
                                    <TableTd>{formatFechaCorte(movimiento.fecha)}</TableTd>
                                    <TableTd>{movimiento.numeroLote}</TableTd>
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

            {modalActivo === "editar-movimiento" && (
                <ModalEditarMovimientos 
                    setMovimientos = {setMovimientos}
                    movimientoSeleccionado = {movimientoSeleccionado}
                    cerrarModal = {() => setModalActivo(null)}
                    updateRefresh = {updateRefresh}
                />
            )}

            {modalActivo === "eliminar-movimiento" && (
                <ModalEliminarMovimientos
                    setMovimientos = {setMovimientos}
                    movimientoSeleccionado = {movimientoSeleccionado}
                    cerrarModal = {() => setModalActivo(null)}
                    updateRefresh = {updateRefresh}
                />
            )}
        </>
    );
};

export default ProductosMovimientos;
