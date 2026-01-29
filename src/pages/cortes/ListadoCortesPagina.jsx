import Button from '@/shared/components/Button';
import Card from '@/shared/components/Card';
import CardTitulo from '@/shared/components/CardTitulo';
import EstadoCorte from '@/shared/components/EstadoCorte';
import Table from '@/shared/components/Table';
import TableTbody from '@/shared/components/TableTbody';
import TableTd from '@/shared/components/TableTd';
import TableTh from '@/shared/components/TableTh';
import TableThead from '@/shared/components/TableThead';
import TableTr from '@/shared/components/TableTr';
import React, { useEffect, useState } from 'react';
import { LuEraser, LuLock, LuLockOpen, LuPencil } from 'react-icons/lu';
import { obtenerCortes } from './services/cortesServices';
import { useSelector } from 'react-redux';
import ModalCrearCorte from './components/cortes/ModalCrearCorte';
import { dateColombiaFormat } from '@/utils/utilities';
import ModalCerrarCorte from './components/cortes/ModalCerrarCorte';
import ModalEliminarCorte from './components/cortes/ModalEliminarCorte';
import Pagination from '@/shared/components/Pagination';
import { useNavigate } from 'react-router-dom';
import { handleErrorsBasic } from '@/utils/handleErrors';
import SkeletonTable from '@/shared/components/SkeletonTable';

const ListadoCortesPagina = () => {
    const [cortes, setCortes] = useState([]);
    const { id: almacenId } = useSelector(state => state?.almacen?.almacen);
    const [paginaActual, setPaginaActual] = useState(1);
    const [corteSeleccionado, setCorteSeleccionado] = useState(null);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [modalActivo, setModalActivo] = useState();
    const navigate = useNavigate();

    // Obtener todos los cortes
    useEffect(() => {
        const fetchCortes = async () => {
            try {
                setLoading(true);
                const resCortes = await obtenerCortes(almacenId, paginaActual);
                setCortes(resCortes.data)
                setPaginaActual(resCortes.paginacion.paginaActual)
                setTotalPaginas(resCortes.paginacion.totalPaginas)
            } catch (error) {
                handleErrorsBasic(error, setError)                
            } finally {
                setLoading(false)
            }
        }
        fetchCortes();
    }, [almacenId, paginaActual])

    const redireccionarInventariosCorte = (corteId) => {
        navigate(`/cortes/${corteId}/productos`)
    }

    return (
        <Card>
            <CardTitulo>Cortes
                <Button
                    colorButton={`primary`}
                    className='ml-3'
                    onClick={() => {
                        setModalActivo("crear-corte")
                    }}
                >
                    Crear 
                </Button>
            </CardTitulo>

            <div className="mt-4">
                <Table>
                    <TableThead>
                        <TableTr>
                            <TableTh>Corte</TableTh>
                            <TableTh className='text-center'>Estado</TableTh>
                            <TableTh className='text-center'>Fecha de inicio</TableTh>
                            <TableTh className='text-center'>Fecha Final</TableTh>
                            <TableTh className='text-center'>Acciones</TableTh>
                        </TableTr>
                    </TableThead>
                    {/* Loading */}
                    {loading && !error && cortes.length === 0 && (
                        <SkeletonTable rows={7} columns={5}/>
                    )}
                    <TableTbody>
                        {!loading && error && (
                            <TableTr>
                                <TableTd colSpan={5}>{error}</TableTd>
                            </TableTr>
                        )}

                        {!loading && !error && cortes.length === 0 && (
                            <TableTr>
                                <TableTd colSpan={5}>No hay cortes por mostrar</TableTd>
                            </TableTr>
                        )}

                        {!loading && !error && cortes.length > 0 && (
                            cortes.map(corte => {
                                return (<TableTr 
                                        key={corte.id}
                                        className="cursor-pointer"
                                        onClick={() => redireccionarInventariosCorte(corte.id)}
                                    >
                                    <TableTd>{corte.nombre}</TableTd>
                                    <TableTd>
                                        <div className="flex items-center justify-center">
                                            <EstadoCorte estado = {corte?.cerrado ? "cerrado": "abierto"}/>
                                        </div>
                                    </TableTd>
                                    <TableTd className='text-center'>{corte?.fechaInicio ? dateColombiaFormat(corte?.fechaInicio): "---"}</TableTd>
                                    <TableTd className='text-center'>{corte?.fechaFin ? dateColombiaFormat(corte?.fechaFin): "---"}</TableTd>
                                    <TableTd>
                                        <div className="flex justify-center gap-1">
                                            <button 
                                                className={`p-1 ${corte?.cerrado ? "cursor-not-allowed" : "cursor-pointer "}`}
                                                title={`Cerrar corte`}
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    setModalActivo("cerrar-corte"); 
                                                    setCorteSeleccionado(corte);
                                                }}
                                                disabled={corte?.cerrado}
                                            >
                                                {corte?.cerrado ? <LuLock />: <LuLockOpen />}
                                            </button>
                                            <button 
                                                className={`p-1 ${corte?.cerrado ? "cursor-not-allowed" : "cursor-pointer "}`}
                                                title={`Eliminar corte`}
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    setModalActivo("eliminar-corte"); 
                                                    setCorteSeleccionado(corte);
                                                }} 
                                                disabled={corte?.cerrado}
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
                {!loading && (
                    <Pagination
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        onPageChange={setPaginaActual}
                    />
                )}
            </div>

            {modalActivo === "crear-corte" && (
                <ModalCrearCorte 
                    cerrarModal = {() => setModalActivo(null)}
                    setCortes={setCortes}
                />
            )}
            {modalActivo === "cerrar-corte" && (
                <ModalCerrarCorte 
                    corteSeleccionado = { corteSeleccionado }
                    cerrarModal = {() => setModalActivo(null)}
                    setCortes={setCortes}
                />
            )}

            {modalActivo === "eliminar-corte" && (
                <ModalEliminarCorte 
                    corteSeleccionado = { corteSeleccionado }
                    cerrarModal = {() => setModalActivo(null)}
                    setCortes={setCortes}
                />
            )}

        </Card>
    );
};

export default ListadoCortesPagina;