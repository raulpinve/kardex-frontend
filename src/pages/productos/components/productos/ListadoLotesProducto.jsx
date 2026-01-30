import useDebounce from '@/shared/hooks/useDebounce';
import React, { useEffect, useState } from 'react';
import TableThead from '@/shared/components/TableThead';
import TableTr from '@/shared/components/TableTr';
import TableTh from '@/shared/components/TableTh';
import Table from '@/shared/components/Table';
import Card from '@/shared/components/Card';
import CardTitulo from '@/shared/components/CardTitulo';
import Button from '@/shared/components/Button';
import { LuEraser, LuMinus, LuPencil, LuPlus, LuSearch } from 'react-icons/lu';
import SkeletonTable from '@/shared/components/SkeletonTable';
import TableTbody from '@/shared/components/TableTbody';
import TableTd from '@/shared/components/TableTd';
import { dateColombiaFormat, formatCantidad, obtenerEstadoVencimiento } from '@/utils/utilities';
import Pagination from '@/shared/components/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerLotes } from '../../services/loteServices';
import ModalCrearLote from '../lotes/ModalCrearLote';
import ModalEditarLote from '../lotes/ModalEditarLote';
import ModalEliminarLote from '../lotes/ModalEliminarLote';
import ModalCrearMovimientos from '../lotes/CrearMovimiento';

const ListadoLotesProducto = ({ tipoProducto, updateRefresh, refresh }) => {
    const [tipoMovimientoSeleccionado, setTipoMovimientoSeleccionado] = useState();
    const [loteSeleccionado, setLoteSeleccionado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lotes, setLotes] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [modalActivo, setModalActivo] = useState(); 
    const [consulta, setConsulta] = useState("");
    const debouncedConsulta = useDebounce(consulta, 500);
    const navigate = useNavigate();
    const {productoId} = useParams();

    // Obtener lotes
    useEffect(() => {
        const fetchCategorias = async () => {
            setLoading(true);
            setError(null); 
            try {
                const respuesta = await obtenerLotes(productoId, paginaActual, debouncedConsulta);
                setLotes(respuesta.data);
                setPaginaActual(respuesta.paginacion.paginaActual);
                setTotalPaginas(respuesta.paginacion.totalPaginas);
            } catch (error) {
                setError(error?.response?.data?.message || "Ocurrió un error al obtener los lotes. Por favor, intenta nuevamente.");
            } finally {
                setLoading(false);
            }
        }
        fetchCategorias();
    }, [debouncedConsulta, paginaActual, productoId, tipoProducto, refresh]);

    const irLote = (loteId) =>{
        navigate(`/${tipoProducto}/lotes/${loteId}`)
    }

    return (
        <Card>
            {/* Titulo */}
            <div className="flex justify-between items-center">
                <CardTitulo>Lotes</CardTitulo>
                <div className="flex gap-1 items-center justify-between">
                    <Button
                        type="button"
                        colorButton="primary"
                        onClick={() => {
                            setModalActivo("crear-lote")
                        }}
                    >   
                        Crear  
                    </Button>
                    <div className="relative hidden lg:block">
                        <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                        <input 
                            type="text" 
                            placeholder="Buscar lote..." 
                            className="input-form pl-10 dark:bg-gray-900"
                            value={consulta}
                            onChange={(e) => {
                                setConsulta(e.currentTarget.value);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Listado */}
            <div className="mt-6">
                <Table>
                    <TableThead>
                        <TableTr>
                            <TableTh>Número de lote</TableTh>
                            <TableTh>Registro sanitario</TableTh>
                            <TableTh>Fecha de vencimiento</TableTh>
                            <TableTh className='text-center'>Stock disponible</TableTh>
                            <TableTh className='text-center'>Acciones</TableTh>
                        </TableTr>
                    </TableThead>
                    {loading && <SkeletonTable rows={7} columns={5}/>}
                    <TableTbody>
                        {/* Display error */}
                        {!loading && error && (<TableTr>
                            <TableTd colSpan={5}>{error}</TableTd>    
                        </TableTr>)}
                        
                        {/* No hay lotes por mostrar */}
                        {!loading && !error && lotes.length === 0 && (<TableTr>
                            <TableTd colSpan={5}>No hay lotes por mostrar.</TableTd>    
                        </TableTr>)}

                        {!loading && !error && lotes.length > 0 && (
                            lotes.map(lote => {
                                const { estado, color } = obtenerEstadoVencimiento(lote.fechaVencimiento);

                                return (<TableTr
                                    key={lote.id}
                                    className={`cursor-pointer text-sm `}
                                    onClick={() => {
                                        irLote(lote.id)
                                    }}
                                >
                                    <TableTd>{lote.numeroLote}</TableTd>
                                    <TableTd>{lote.registroSanitario}</TableTd>
                                    <TableTd>
                                        <div className="py-3 px-4 lg:flex lg:gap-2 items-center">
                                            <p>{dateColombiaFormat(lote.fechaVencimiento)}</p>
                                            <p className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${color}`}>
                                                {estado}
                                            </p>
                                        </div>
                                    </TableTd>
                                    <TableTd className='text-center'>
                                        {formatCantidad(lote.stockDisponible)}
                                    </TableTd>
                                    <TableTd>
                                        <div className="text-gray-700 dark:text-gray-400 flex gap-1 justify-center ">
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    className="cursor-pointer px-2 py-1 bg-green-600 text-white rounded-lg text-xs flex items-center gap-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setModalActivo("crear-movimiento");
                                                        setTipoMovimientoSeleccionado("entrada");
                                                        setLoteSeleccionado(lote);
                                                    }}
                                                >
                                                    <LuPlus /> Ingreso
                                                </button>
                                                <button
                                                    className="cursor-pointer px-2 py-1 bg-red-600 text-white rounded-lg text-xs flex items-center gap-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setModalActivo("crear-movimiento");
                                                        setTipoMovimientoSeleccionado("salida");
                                                        setLoteSeleccionado(lote);
                                                    }}
                                                >
                                                    <LuMinus /> Salida
                                                </button>
                                            </div>
                                            <button
                                                className="cursor-pointer p-1"
                                                title="Editar lote"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModalActivo("editar-lote");
                                                    setLoteSeleccionado(lote);
                                                }}
                                            >
                                                <LuPencil />
                                            </button>
                                            <button
                                                className="cursor-pointer p-1"
                                                title="Eliminar lote"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setLoteSeleccionado(lote);
                                                    setModalActivo("eliminar-lote");
                                                }}
                                            >
                                                <LuEraser />
                                            </button>
                                        </div>
                                    </TableTd>
                                </TableTr>)
                            })
                        )}
                    </TableTbody>
                </Table>
                <Pagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onPageChange={setPaginaActual}
                />
            </div>

            {modalActivo === "crear-lote" && (
                <ModalCrearLote 
                    setLotes = {setLotes}
                    cerrarModal = {() => setModalActivo(null)}
                    updateRefresh={updateRefresh}
                />
            )}

            {modalActivo === "editar-lote" && (
                <ModalEditarLote 
                    setLotes = {setLotes}
                    cerrarModal = {() => setModalActivo(null)}
                    loteSeleccionado = {loteSeleccionado}
                />
            )}

            {modalActivo === "eliminar-lote" && (
                <ModalEliminarLote 
                    setLotes = {setLotes}
                    cerrarModal = {() => setModalActivo(null)}
                    loteSeleccionado = {loteSeleccionado}
                    updateRefresh={updateRefresh}
                />
            )}

            {modalActivo === "crear-movimiento" && (
                <ModalCrearMovimientos 
                    loteSeleccionado = {loteSeleccionado}
                    tipoMovimiento = {tipoMovimientoSeleccionado}
                    cerrarModal = {() => setModalActivo(null)}
                    setLotes = {setLotes}
                    updateRefresh={updateRefresh}
                />
            )}
        </Card>
    );
};

export default ListadoLotesProducto;