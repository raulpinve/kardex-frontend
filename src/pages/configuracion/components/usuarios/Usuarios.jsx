import { LuEraser, LuLock, LuPencil, LuSearch } from "react-icons/lu";
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
import imageDefault from "../../../../assets/images/image-default.png";
import ModalAbrirImagenPerfil from "../../../../shared/components/ModalAbrirImagenPerfil";
import Table from "@/shared/components/Table";
import TableThead from "@/shared/components/TableThead";
import TableTr from "@/shared/components/TableTr";
import TableTh from "@/shared/components/TableTh";
import TableTbody from "@/shared/components/TableTbody";
import TableTd from "@/shared/components/TableTd";

const PARSEAR_ROLES = {
    "superadmin": "Superadministrador",
    "admin": "Administrador",
    "viewer": "Lector", 
    "editor": "Editor"
}

const Usuarios = () => {
    const [modalActivo, setModalActivo] = useState(null);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [consulta, setConsulta] = useState("");
    const debouncedConsulta = useDebounce(consulta, 500);
    const navigate = useNavigate();

    // Obtener usuarios
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            setError(null); 

            try {
                const respuesta = await obtenerUsuarios(paginaActual, debouncedConsulta)
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
    }, [debouncedConsulta, paginaActual])

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
                           Crear 
                        </Button>
                        <div className="relative hidden md:block">
                            <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                            <input 
                                type="text" 
                                placeholder="Buscar..." 
                                className="input-form pl-10 dark:bg-gray-900"
                                value={consulta}
                                onChange={(e) => {
                                    setConsulta(e.currentTarget.value);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-aut pt-4">
                    <Table>
                        <TableThead>
                            <TableTr>
                                <TableTh>Nombres</TableTh>
                                <TableTh>E-mail</TableTh>
                                <TableTh>Username</TableTh>
                                <TableTh>Rol</TableTh>
                                <TableTh>Acciones</TableTh>
                            </TableTr>
                        </TableThead>
                        {loading && <SkeletonTable rows={7} columns={5}/>}
                        <TableTbody>
                            {!loading && error && (
                                <TableTr>
                                    <TableTd colSpan={5}>{error}</TableTd>
                                </TableTr>
                            )}
                            {!loading && !error && usuarios.length === 0 && (
                                <TableTr>
                                    <TableTd colSpan={5}>No hay usuarios por mostrar</TableTd>
                                </TableTr>
                            )}
                            {!loading && !error && usuarios.length > 0 && (
                                usuarios.map(usuario => {
                                    return <tr 
                                        key={usuario.id}
                                        className="cursor-pointer"
                                        onClick={() => redireccionarUsuario(usuario.id)}
                                    >
                                        <TableTd>
                                            <div className="flex items-center gap-2">
                                                <img 
                                                    src={`${usuario.avatarThumbnail}`}
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
                                                    className="w-8 h-8 block object-cover rounded-full select-none cursor-pointer"  
                                                />
                                                <p className="text-gray-700 dark:text-gray-400"> {usuario.primerNombre} {usuario.apellidos}</p>
                                            </div>
                                        </TableTd>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {usuario.email} </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {usuario.username} </p>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="text-gray-700 dark:text-gray-400"> {PARSEAR_ROLES[usuario.rol]} </p>
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
                                })
                            )}
                        </TableTbody>
                    </Table>
                </div>
                {!loading && (
                    <Pagination
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        onPageChange={setPaginaActual}
                    />
                )}
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