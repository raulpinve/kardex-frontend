import React, { useState } from "react";
import Card from "../../shared/components/Card";
import CardTitulo from "../../shared/components/CardTitulo";
import Button from "../../shared/components/Button";
import { LuLockKeyhole, LuPencil } from "react-icons/lu";
import { useSelector } from "react-redux";
import ModalEditarPerfil from "./components/ModalEditarPerfil";
import SubirImagenPerfil from "./components/SubirImagenPerfil";
import ModalAbrirImagenPerfil from "./components/ModalAbrirImagenPerfil";
import ModalEditarContrasena from "./components/ModalEditarContrasena";

const PerfilPagina = () => {
    const usuario = useSelector(state => state.auth.usuario);
    const [modalActivo, setModalActivo] = useState("");

    return (<>
        <div className="mt-4">
            <Card>
                <CardTitulo>Perfil</CardTitulo>
                <div className="p-5 mb-6 mt-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 flex justify-between items-center">
                    <div className="flex gap-3">
                        <SubirImagenPerfil usuario={usuario} setModalActivo={setModalActivo} />
                        <div className="order-3 xl:order-2">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                {usuario?.primerNombre} {usuario?.apellidos}
                            </h4>
                            <div className="flex flex-col items-start gap-1 xl:flex-row xl:gap-3">
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-justify">{usuario?.username}</p>
                                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{usuario?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 flex justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Información personal
                        </h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Primer nombre */}
                            <div>
                                <p className="text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Primer nombre
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {usuario?.primerNombre}
                                </p>
                            </div>

                            {/* Apellidos */}
                            <div>
                                <p className="text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Apellidos
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {usuario?.apellidos}
                                </p>
                            </div>

                            {/* Username */}
                            <div>
                                <p className="text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Username
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {usuario?.username}
                                </p>
                            </div>

                            {/* E-mail */}
                            <div>
                                <p className="text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    E-mail
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {usuario?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button 
                        className="rounded-full"
                        colorButton={`secondary`}
                        onClick={() => { setModalActivo("editar") }}
                    >
                        <LuPencil /> Editar  
                    </Button>
                </div>

                <div className="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 flex justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Seguridad
                        </h4>
                        
                        <Button 
                            className="rounded-full"
                            colorButton={`secondary`}
                            onClick={() => { setModalActivo("editar-contrasena") }}
                        >   
                            <LuPencil />
                            <LuLockKeyhole />
                            Editar contraseña
                        </Button>
                    </div>

                </div>
            </Card>
        </div>  
        {modalActivo === "editar" && (
            <ModalEditarPerfil 
                isOpenModal = {true}
                cerrarModal={() => setModalActivo(null)}
            />
        )}
        {modalActivo === "imagen-perfil" && (
            <ModalAbrirImagenPerfil 
                cerrarModal={() => setModalActivo(null)}
                usuario = {usuario}
            />
        )}

        {modalActivo === "editar-contrasena" && (
            <ModalEditarContrasena 
                cerrarModal={() => setModalActivo(null)}
            />
        )}
    </>);
};

export default PerfilPagina;