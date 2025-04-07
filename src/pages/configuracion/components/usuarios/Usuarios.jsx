import { LuChevronLeft, LuChevronRight, LuEraser, LuLock, LuPencil, LuRefreshCcw, LuSearch } from 'react-icons/lu';
import React, { useEffect, useState } from 'react';
import Button from '../../../../shared/components/Button';
import ModalCrearUsuario from './ModalCrearUsuario';
import { useSelector } from 'react-redux';
import { obtenerUsuarios } from '../../services/usuarioService';
import SkeletonTable from '../../../../shared/components/SkeletonTable';
import Pagination from '../../../../shared/components/Pagination';
import ModalEditarUsuario from './ModalEditarUsuario';
import ModalEditarPrivilegiosAlmacen from './ModalEditarPrivilegiosAlmacen';
import ModalEliminarUsuario from './ModalEliminarUsuario';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import useDebounce from '../../../../shared/hooks/useDebounce';

const Usuarios = () => {
    const [modalActivo, setModalActivo] = useState(null); // 'crear', 'editar', 'eliminar', etc.
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const token = useSelector(state => state.auth.token);
    const [refresh, setRefresh] = useState(0); 
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [consulta, setConsulta] = useState("");

    const ROLES = {
        "admin": "Administrador",
        "viewer": "Lector", 
        "editor": "Editor"
    }

    const debouncedConsulta = useDebounce(consulta, 500);

    // Obtener usuarios
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            setError(null); // Limpia el error antes de realizar la consulta

            try {
                const respuesta = await obtenerUsuarios(token, paginaActual, debouncedConsulta)
                setUsuarios(respuesta.data)
                setPaginaActual(respuesta.paginacion.paginaActual);
                setTotalPaginas(respuesta.paginacion.totalPaginas);

            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno");
            } finally {
                setLoading(false);
            }
        }
        fetchUsuarios();
    }, [debouncedConsulta, token, refresh, paginaActual])

    return (
        <>
            <Card>
                <div className='flex justify-between items-center'>
                    <CardTitulo>Usuarios</CardTitulo>
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
                                placeholder="Buscar usuario..." 
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
                                <p className='font-medium text-gray-700 dark:text-gray-400'>Nombres</p>
                            </th>
                            <th className='py-3'>
                                <p className='font-medium text-gray-700 dark:text-gray-400'>E-mail</p>
                            </th>
                            <th className='py-3'>
                                <p className='font-medium text-gray-700 dark:text-gray-400'>Username</p>
                            </th>
                            <th className='py-3'>
                                <p className='font-medium text-gray-700 dark:text-gray-400'>Rol</p>
                            </th>
                            <th className='py-3'>
                                <p className='font-medium text-gray-700 dark:text-gray-400'>Acciones</p>
                            </th>
                        </tr>
                    </thead>
                    {loading ? <SkeletonTable rows={7} columns={5}/>: 
                        <tbody className='divide-y divide-gray-100  text-sm dark:divide-gray-800'>
                            {error ? <tr>
                                <td colSpan="5" className='py-3'>
                                    <p className='text-gray-700 dark:text-gray-400 text-center'> {error}</p>
                                </td>
                            </tr> : 
                            <>
                                {usuarios.length === 0 ? 
                                    <tr>
                                        <td colSpan="5" className='py-3'>
                                            <p className='text-gray-700 dark:text-gray-400 text-center'> No hay usuarios por mostrar</p>
                                        </td>
                                    </tr>: 
                                    <>
                                        {usuarios.map(usuario => {
                                            return <tr key={usuario.id}>
                                                <td className='py-3'>
                                                    <div className='items-center flex gap-3 rounded-full'>
                                                        {/* <img 
                                                            src="https://picsum.photos/100"
                                                            alt=""
                                                            className='w-10 h-10 object-cover rounded-full'
                                                        /> */}
                                                        <p className='text-gray-700 dark:text-gray-400'> {usuario.primerNombre} {usuario.apellidos}</p>
                                                    </div>
                                                </td>
                                                <td className='py-3'>
                                                    <p className='text-gray-700 dark:text-gray-400'> {usuario.email} </p>
                                                </td>
                                                <td className='py-3'>
                                                    <p className='text-gray-700 dark:text-gray-400'> {usuario.username} </p>
                                                </td>
                                                <td className='py-3'>
                                                    <p className='text-gray-700 dark:text-gray-400'> {ROLES[usuario.rol]} </p>
                                                </td>
                                                <td className='py-3'>
                                                    <div className='text-gray-700 dark:text-gray-400 flex gap-2'>
                                                        <button 
                                                            className='cursor-pointer'
                                                            title='Editar usuario'
                                                            onClick={() => {
                                                                setModalActivo('editar'); 
                                                                setUsuarioSeleccionado(usuario);
                                                            }}    
                                                        >
                                                            <LuPencil />
                                                        </button>
                                                        <button 
                                                            className='cursor-pointer'
                                                            title='Editar privilegios'
                                                            onClick={() => {
                                                                setUsuarioSeleccionado(usuario);
                                                                setModalActivo('privilegios'); 
                                                            }}  
                                                        >
                                                            <LuLock  />
                                                        </button>
                                                        <button 
                                                            className='cursor-pointer'
                                                            title='Eliminar usuario'
                                                            onClick={() => {
                                                                setUsuarioSeleccionado(usuario);
                                                                setModalActivo('eliminar'); 
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
                        </tbody>
                    }
                </table>
                <Pagination
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onPageChange={setPaginaActual}
                />
            </Card>

            {modalActivo === "crear" && (
                <ModalCrearUsuario 
                    isOpenModal = {true}
                    cerrarModal={() => setModalActivo(null)}
                    setUsuarios = {setUsuarios}
                />
            )}
            {modalActivo === "editar" && usuarioSeleccionado && (
                <ModalEditarUsuario 
                    isOpenModal = {true}
                    cerrarModal={() => setModalActivo(null)}
                    setUsuarios = {setUsuarios}
                    usuarioSeleccionado = {usuarioSeleccionado}
                />
            )}

            {modalActivo === "privilegios" && usuarioSeleccionado && (
                <ModalEditarPrivilegiosAlmacen 
                    isOpenModal = {true}
                    cerrarModal={() => setModalActivo(null)}
                    usuarioSeleccionado = {usuarioSeleccionado}
                    setUsuarioSeleccionado = {setUsuarioSeleccionado}
                />
            )}

            {modalActivo === "eliminar" && usuarioSeleccionado && (
                <ModalEliminarUsuario 
                    isOpenModal = {true}
                    cerrarModal={() => setModalActivo(null)}
                    setUsuarios = {setUsuarios}
                    usuarioSeleccionado = {usuarioSeleccionado}
                />
            )}
        </>
    );
};

export default Usuarios;