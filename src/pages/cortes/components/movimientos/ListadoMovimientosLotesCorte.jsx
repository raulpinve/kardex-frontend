import Card from '@/shared/components/Card';
import CardTitulo from '@/shared/components/CardTitulo';
import SkeletonTable from '@/shared/components/SkeletonTable';
import Table from '@/shared/components/Table';
import TableTbody from '@/shared/components/TableTbody';
import TableTd from '@/shared/components/TableTd';
import TableTh from '@/shared/components/TableTh';
import TableThead from '@/shared/components/TableThead';
import TableTr from '@/shared/components/TableTr';
import React, { useEffect, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import { obtenerMovimientosLotesCorte } from '../../services/movimientosServices';
import useDebounce from '@/shared/hooks/useDebounce';
import { dateColombiaFormat, formatCantidad, formatFechaCorte } from '@/utils/utilities';
import Pagination from '@/shared/components/Pagination';

const ListadoMovimientosLotesCorte = () => {
    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState();
    const [error, setError] = useState();
    const {loteId, corteId} = useParams();
    const [paginaActual, setPaginaActual] = useState();
    const [totalPaginas, setTotalPaginas] = useState();
    const [consulta, setConsulta] = useState("");
    const debouncedConsulta = useDebounce(consulta, 500);
    const [tipo, setTipo] = useState("");
    const [fecha, setFecha] = useState("");

    useEffect(() => {
        const fetchMovimientos = async () => {
            setLoading(true);
            setError(null);

            try {
                const respuesta = await obtenerMovimientosLotesCorte(corteId, loteId, tipo, fecha, paginaActual, debouncedConsulta);
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
    }, [corteId, loteId, debouncedConsulta, paginaActual, tipo, fecha]);

    return (
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
                    <div className=" hidden sm:block">
                        <input 
                            className='input-form' 
                            type="date" 
                            value={fecha}
                            onChange={e => setFecha(e.currentTarget.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Listado de movimientos */}
            <div className="mt-4 text-sm">
                <Table>
                    <TableThead>
                        <TableTr>
                            <TableTh>Fecha</TableTh>
                            <TableTh>Tipo</TableTh>
                            <TableTh>Cantidad</TableTh>
                            <TableTh>Descripción</TableTh>
                        </TableTr>
                    </TableThead>
                    {loading && <SkeletonTable rows={7} columns={5} />}
                    <TableTbody>
                        {!loading && error && (
                            <TableTr>
                                <TableTd colSpan={5}>{error}</TableTd>
                            </TableTr>
                        )}
                        {!loading && !error && movimientos.length === 0 && (
                            <TableTr>
                                <TableTd colSpan={5}>No hay movimientos por mostrar</TableTd>
                            </TableTr>
                        )}
                        {!loading && !error && movimientos.length > 0 && movimientos.map(movimiento => (
                            <TableTr key={movimiento.id}>
                                <TableTd>{ dateColombiaFormat(movimiento.fecha) }</TableTd>
                                <TableTd className='capitalize'>{ movimiento.tipo }</TableTd>
                                <TableTd>{ formatCantidad(movimiento.cantidad) }</TableTd>
                                <TableTd>{ movimiento.descripcion || "---" }</TableTd>
                            </TableTr>
                        ))}
                    </TableTbody>
                </Table>

                {/* Paginación */}
                <Pagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onPageChange={setPaginaActual}
                />
            </div>
        </Card>
    );
};

export default ListadoMovimientosLotesCorte;