import React, { useState } from "react";
import Layout from "../../shared/components/Layout";
import Title from "../../shared/components/Title";
import Card from "../../shared/components/Card";
import CardTitulo from "../../shared/components/CardTitulo";
import Button from "../../shared/components/Button";
import { LuPencil } from "react-icons/lu";
import { useSelector } from "react-redux";
import ModalEditarPerfil from "./components/ModalEditarPerfil";
import SubirImagenPerfil from "./components/SubirImagenPerfil";
import ModalAbrirImagenPerfil from "./components/ModalAbrirImagenPerfil";

const PerfilPagina = () => {
    const usuario = useSelector(state => state.auth.usuario);
    const [modalActivo, setModalActivo] = useState("");
    return (
        <>
            <Layout>
                <Title>Perfil</Title>    
                <div className="mt-4">
                    <Card>
                        <CardTitulo>Perfil</CardTitulo>
                        <div className="p-5 mb-6 mt-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 flex justify-between items-center">
                            <div className="flex gap-3">
                                <SubirImagenPerfil usuario={usuario} setModalActivo={setModalActivo} />
                                <div className="order-3 mt-3 xl:order-2">
                                    <h4 className="text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                                        {usuario?.primerNombre} {usuario?.apellidos}
                                    </h4>
                                    <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {usuario?.username}
                                        </p>
                                        <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {usuario?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <div className="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 flex justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                        Información personal
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
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
                        </div>
                    </Card>
                </div>  
            </Layout>
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
        </>
    );
};

export default PerfilPagina;