import useDebounce from '@/shared/hooks/useDebounce';
import React, { useEffect, useState } from 'react';
import { obtenerLotes } from '../../services/loteServices';
import TableThead from '@/shared/components/TableThead';
import TableTr from '@/shared/components/TableTr';
import TableTh from '@/shared/components/TableTh';
import Table from '@/shared/components/Table';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '@/shared/components/Card';
import CardTitulo from '@/shared/components/CardTitulo';
import Button from '@/shared/components/Button';
import { LuEraser, LuPencil, LuRefreshCcw, LuSearch } from 'react-icons/lu';
import SkeletonTable from '@/shared/components/SkeletonTable';
import TableTbody from '@/shared/components/TableTbody';
import TableTd from '@/shared/components/TableTd';
import { dateColombiaFormat, formatCantidad, obtenerEstadoVencimiento } from '@/utils/utilities';

const ListadoLotesProducto = ({ tipo }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lotes, setLotes] = useState([]);
    const [loteSeleccionado, setLoteSeleccionado] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [modalActivo, setModalActivo] = useState(); 
    const {productoId} = useParams();
    const token = useSelector(state => state.auth.token);
    const [consulta, setConsulta] = useState("");
    const navigate = useNavigate();

    const debouncedConsulta = useDebounce(consulta, 500);

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
    }, [debouncedConsulta, paginaActual, token, productoId, tipo]);
    
    const irALote = (loteId) => {
        navigate(`/${tipo}/lotes/${loteId}`)
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
                            setModalActivo("crear")
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
                    <Button
                        type="button"
                        colorButton="secondary"
                        className="hidden md:block"
                        onClick={() => {
                            setPaginaActual(1)
                        }}
                    >
                        <LuRefreshCcw />
                    </Button>
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
                            <TableTh>Stock disponible</TableTh>
                            <TableTh>Acciones</TableTh>
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
                                        className={`cursor-pointer text-sm`}
                                        onClick={() => irALote(lote.id)}
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
                                        <TableTd>
                                            {formatCantidad(lote.stockDisponible)}
                                        </TableTd>
                                        <TableTd>
                                            <div className="text-gray-700 dark:text-gray-400 flex gap-2">
                                                <button
                                                    className="cursor-pointer p-1"
                                                    title="Editar lote"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setModalActivo("editar");
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
                                                        setModalActivo("eliminar");
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

            </div>
        </Card>
    );
};

export default ListadoLotesProducto;