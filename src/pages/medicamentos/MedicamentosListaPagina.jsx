import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import CardTitulo from '../../shared/components/CardTitulo';
import Button from '../../shared/components/Button';
import { LuEraser, LuPencil, LuRefreshCcw, LuSearch } from 'react-icons/lu';
import Card from '../../shared/components/Card';
import useDebounce from '../../shared/hooks/useDebounce';
import { obtenerMedicamentos } from './services/medicamentosServices';
import { useSelector } from 'react-redux';
import SkeletonTable from '../../shared/components/SkeletonTable';
import { useNavigate, useParams } from 'react-router-dom';
import Pagination from '../../shared/components/Pagination';
import ModalCrearMedicamento from './components/medicamentos/ModalCrearMedicamento';
import ModalEditarMedicamento from './components/medicamentos/ModalEditarMedicamento';
import ModalEliminarMedicamento from './components/medicamentos/ModalEliminarMedicamento';

const MedicamentosListaPagina = () => {
    const [modalActivo, setModalActivo] = useState(); // Establece la modal que estará activa
    const [consulta, setConsulta] = useState("");
    const [loading, setLoading] = useState(null);
    const token = useSelector(state => state.auth.token);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [medicamentos, setMedicamentos] = useState([]);
    const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
    const [refresh, setRefresh] = useState(0); 
    const [error, setError] = useState(null);
    const {almacenId} = useParams();
    const navigate = useNavigate();

    const debouncedConsulta = useDebounce(consulta, 500);

    // Obtener usuarios
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            setError(null); 
            
            try {
                const respuesta = await obtenerMedicamentos(token, almacenId, paginaActual, debouncedConsulta)
                setMedicamentos(respuesta.data)
                setPaginaActual(respuesta.paginacion.paginaActual);
                setTotalPaginas(respuesta.paginacion.totalPaginas);

            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno");
            } finally {
                setLoading(false);
            }
        }
        fetchUsuarios();
    }, [debouncedConsulta, token, refresh, paginaActual]);

    // Redireccionar   
    const irAMedicamento = (id) => {
        navigate(`/medicamentos/${id}`);
    };

    return (
        <>
            <Layout>
                <Card>
                    {/* Header */}
                    <div className='flex justify-between items-center'>
                        <CardTitulo>Medicamentos</CardTitulo>
                        <div className='flex gap-1 items-center justify-between'>
                            <Button
                                type="button"
                                colorButton="secondary"
                                onClick={() => {
                                    setModalActivo("crear")
                                }}
                            >   
                                Crear
                            </Button>
                            <div className="relative hidden md:block">
                                <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar medicamento..." 
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
                                onClick={() => {
                                    setPaginaActual(1)
                                    setRefresh((prev) => prev + 1)
                                }}
                            >
                                <LuRefreshCcw />
                            </Button>
                        </div>
                    </div>
                    <table className='min-w-full mt-3'>
                        <thead>
                            <tr className='border-gray-100 border-y  text-sm dark:border-gray-800 text-left'>
                                <th className='py-3'>
                                    <p className='font-medium text-gray-700 dark:text-gray-400'>Principio activo</p>
                                </th>
                                <th className='py-3'>
                                    <p className='font-medium text-gray-700 dark:text-gray-400'>Forma farmacéutica</p>
                                </th>
                                <th className='py-3'>
                                    <p className='font-medium text-gray-700 dark:text-gray-400'>Concentración</p>
                                </th>
                                <th className='py-3'>
                                    <p className='font-medium text-gray-700 dark:text-gray-400'>Presentación</p>
                                </th>
                                <th className='py-3'>
                                    <p className='font-medium text-gray-700 dark:text-gray-400'>Unidad médica</p>
                                </th>
                                <th className='py-3'>
                                    <p className='font-medium text-gray-700 dark:text-gray-400'>Stock requerido</p>
                                </th>
                                <th className='py-3'>
                                    <p className='font-medium text-gray-700 dark:text-gray-400'>Acciones</p>
                                </th>
                            </tr>
                        </thead>

                        {loading ? <SkeletonTable rows={7} columns={7}/>: 
                            <tbody className='divide-y divide-gray-100  text-sm dark:divide-gray-800'>
                                {error ? <tr>
                                    <td colSpan="7" className='py-3'>
                                        <p className='text-gray-700 dark:text-gray-400 text-center'> {error}</p>
                                    </td>
                                </tr> : 
                                <>
                                    {medicamentos.length === 0 ? 
                                        <tr>
                                            <td colSpan="7" className='py-3'>
                                                <p className='text-gray-700 dark:text-gray-400 text-center'> No hay medicamentos por mostrar</p>
                                            </td>
                                        </tr>: 
                                        <>
                                            {medicamentos.map(medicamento => {
                                                return <tr 
                                                    key={medicamento.id}
                                                    onClick={() => irAMedicamento(medicamento.id)}
                                                    className='cursor-pointer'
                                                >
                                                    <td className='py-3'>
                                                        <div className='items-center flex gap-3 rounded-full'>
                                                            <p className='text-gray-700 dark:text-gray-400'> {medicamento.nombre}</p>
                                                        </div>
                                                    </td>
                                                    <td className='py-3'>
                                                        <p className='text-gray-700 dark:text-gray-400'> {medicamento.formaFarmaceutica} </p>
                                                    </td>
                                                    <td className='py-3'>
                                                        <p className='text-gray-700 dark:text-gray-400'> {medicamento.concentracion} </p>
                                                    </td>
                                                    <td className='py-3'>
                                                        <p className='text-gray-700 dark:text-gray-400'> {medicamento.presentacionComercial} </p>
                                                    </td>
                                                    <td className='py-3'>
                                                        <p className='text-gray-700 dark:text-gray-400'> {medicamento.unidadMedida} </p>
                                                    </td>
                                                    <td className='py-3'>
                                                        <p className='text-gray-700 dark:text-gray-400'> {medicamento.stockRequerido} </p>
                                                    </td>
                                                    <td className='py-3'>
                                                        <div className='text-gray-700 dark:text-gray-400 flex gap-2'>
                                                            
                                                            <button 
                                                                className='cursor-pointer'
                                                                title='Editar medicamento'
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // evita que se dispare el onClick del <tr>
                                                                    setModalActivo('editar'); 
                                                                    setMedicamentoSeleccionado(medicamento);
                                                                }}    
                                                            >
                                                                <LuPencil />
                                                            </button>
                                                            <button 
                                                                className='cursor-pointer'
                                                                title='Eliminar medicamento'
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // evita que se dispare el onClick del <tr>
                                                                    setModalActivo('eliminar'); 
                                                                    setMedicamentoSeleccionado(medicamento);
                                                                }} 
                                                            >
                                                                <LuEraser />
                                                            </button> 
                                                        </div>
                                                    </td>
                                                </tr>
                                            })}
                                        </>
                                        }
                                    </>}
                            </tbody>}
                    </table>
                    <Pagination
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        onPageChange={setPaginaActual}
                    />
                </Card>
            </Layout>

            {modalActivo === "crear" && (
                <ModalCrearMedicamento 
                    cerrarModal={() => setModalActivo(null)} 
                    setMedicamentos = {setMedicamentos}
                    almacenId = {almacenId}
                />
            )}

            {modalActivo === "editar" && (
                <ModalEditarMedicamento 
                    cerrarModal={() => setModalActivo(null)} 
                    setMedicamentos = {setMedicamentos}
                    medicamentoSeleccionado = {medicamentoSeleccionado}
                />
            )}

            
            {modalActivo === "eliminar" && (
                <ModalEliminarMedicamento 
                    cerrarModal={() => setModalActivo(null)} 
                    setMedicamentos = {setMedicamentos}
                    medicamentoSeleccionado = {medicamentoSeleccionado}
                />
            )}
        </>
    );
};

export default MedicamentosListaPagina;