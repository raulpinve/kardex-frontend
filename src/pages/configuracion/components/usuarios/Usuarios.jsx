import { LuEraser, LuLock, LuPencil, LuPlus, LuRefreshCcw, LuSearch } from "react-icons/lu";
import React, { useEffect, useState } from "react";
import Button from "../../../../shared/components/Button";
import ModalCrearUsuario from "./ModalCrearUsuario";
import { useSelector } from "react-redux";
import { obtenerUsuarios } from "../../services/usuarioService";
import SkeletonTable from "../../../../shared/components/SkeletonTable";
import Pagination from "../../../../shared/components/Pagination";
import ModalEditarUsuario from "./ModalEditarUsuario";
import ModalEditarPrivilegiosAlmacen from "./ModalEditarPrivilegiosAlmacen";
import ModalEliminarUsuario from "./ModalEliminarUsuario";
import Card from "../../../../shared/components/Card";
import CardTitulo from "../../../../shared/components/CardTitulo";
import useDebounce from "../../../../shared/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { host } from "../../../../utils/config";
import imageDefault from "../../../../assets/image-default.png";
import ModalAbrirImagenPerfil from "../../../../shared/components/ModalAbrirImagenPerfil";

const Usuarios = () => {
    const [modalActivo, setModalActivo] = useState(null);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(0); 
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [consulta, setConsulta] = useState("");
    const token = useSelector(state => state.auth.token);
    const navigate = useNavigate();

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
            setError(null); 

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

    const redireccionarUsuario = (usuarioId) => {
        navigate(`/perfil/${usuarioId}`)
    }

    return (
        <>
            <Card>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <CardTitulo>Usuarios</CardTitulo>
                    <div className="flex gap-1 items-center justify-between">
                        <Button
                            type="button"
                            colorButton="primary"
                            onClick={() => {
                                setModalActivo("crear")
                            }}
                        >   
                           Crear  <LuPlus />
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
                        {/* <Button
                            type="button"
                            colorButton="secondary"
                            onClick={() => {
                                setPaginaActual(1)
                                setRefresh((prev) => prev + 1)
                            }}
                        >
                            <LuRefreshCcw />
                        </Button> */}
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto mt-3">
                        <thead>
                            <tr className="border-gray-100 border-y  text-sm dark:border-gray-800 text-left">
                                <th className="w-[50px] "></th>
                                <th className="pl-1 pr-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Nombres</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">E-mail</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Username</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Rol</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Acciones</p>
                                </th>
                            </tr>
                        </thead>
                        {loading ? <SkeletonTable rows={7} columns={5}/>: 
                            <tbody className="divide-y divide-gray-100  text-sm dark:divide-gray-800">
                                {error ? <tr>
                                    <td colSpan="5" className="py-3">
                                        <p className="text-gray-700 dark:text-gray-400 text-center"> {error}</p>
                                    </td>
                                </tr> : 
                                <>
                                    {usuarios.length === 0 ? 
                                        <tr>
                                            <td colSpan="6" className="py-3">
                                                <p className="text-gray-700 dark:text-gray-400 text-center"> No hay usuarios por mostrar</p>
                                            </td>
                                        </tr>: 
                                        <>
                                            {usuarios.map(usuario => {
                                                return <tr 
                                                    key={usuario.id}
                                                    className="cursor-pointer"
                                                    onClick={() => redireccionarUsuario(usuario.id)}
                                                >
                                                    <td className="py-3 min-w-[50px] w-[50px]">
                                                        <img 
                                                            src={`${host}${usuario.avatarThumbnail}`}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = imageDefault; 
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setUsuarioSeleccionado(usuario);
                                                                setModalActivo("imagen-perfil");
                                                            }}
                                                            alt="Perfil" 
                                                            className="w-8 h-8 block mx-auto object-cover rounded-full select-none cursor-pointer"  
                                                        />
                                                    </td>
                                                    <td className="pl-1 py-3 pr-4">
                                                        <p className="text-gray-700 dark:text-gray-400"> {usuario.primerNombre} {usuario.apellidos}</p>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <p className="text-gray-700 dark:text-gray-400"> {usuario.email} </p>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <p className="text-gray-700 dark:text-gray-400"> {usuario.username} </p>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <p className="text-gray-700 dark:text-gray-400"> {ROLES[usuario.rol]} </p>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="text-gray-700 dark:text-gray-400 flex gap-2">
                                                            <button 
                                                                className="cursor-pointer p-1"
                                                                title="Editar usuario"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setModalActivo("editar"); 
                                                                    setUsuarioSeleccionado(usuario);
                                                                }}    
                                                            >
                                                                <LuPencil />
                                                            </button>
                                                            <button 
                                                                className="cursor-pointer p-1"
                                                                title="Editar privilegios"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setUsuarioSeleccionado(usuario);
                                                                    setModalActivo("privilegios"); 
                                                                }}  
                                                            >
                                                                <LuLock  />
                                                            </button>
                                                            <button 
                                                                className="cursor-pointer p-1"
                                                                title="Eliminar usuario"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setUsuarioSeleccionado(usuario);
                                                                    setModalActivo("eliminar"); 
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
                </div>
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
            {modalActivo === "imagen-perfil" && (
                <ModalAbrirImagenPerfil 
                    cerrarModal={() => setModalActivo(null)}
                    urlImage = {`${usuarioSeleccionado.avatar}`}
                    tipo="perfil"
                />
            )}
        </>
    );
};

export default Usuarios;