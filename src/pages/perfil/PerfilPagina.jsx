import React, { useEffect, useState } from "react";
import Layout from "../../shared/components/Layout";
import Title from "../../shared/components/Title";
import Card from "../../shared/components/Card";
import CardTitulo from "../../shared/components/CardTitulo";
import { host } from "../../utils/config";
import { useSelector } from "react-redux";
import ModalAbrirImagenPerfil from "./components/ModalAbrirImagenPerfil";
import imageDefault from "../../assets/images/image-default.png";
import { useParams } from "react-router-dom";
import { obtenerPerfil } from "./services/perfilService";
import ErrorPage from "../../shared/components/ErrorPage";
import SkeletonElement from "../../shared/components/SkeletonElement";

const PerfilPagina = () => {
    const token = useSelector(state => state.auth.token);
    const [error, setError] = useState(false);
    const [modalActivo, setModalActivo] = useState("");
    const [loading, setLoading] = useState(false);
    const {perfilId} = useParams();
    const [perfil, setPerfil] = useState(false);

    useEffect(() => {
        // Si no hay perfilId, no hacemos nada
        if (!perfilId) return;
    
        // Obtener la información del perfil
        const fetchPerfil = async () => {
          try {
            setLoading(true);  // Indicamos que está cargando
            setError(null);     // Limpiamos cualquier error previo
            const response = await obtenerPerfil(token, perfilId);
    
            if (response.data) {
              setPerfil(response.data);
            }
          } catch (error) {
            const statusCode = error?.response?.data?.statusCode || 500;
            const message = error?.response?.data?.message || 'Ha ocurrido un error interno';
            setError({ code: statusCode, message });
          } finally {
            setLoading(false);  // Indicamos que ha terminado la carga
          }
        };
    
        fetchPerfil();
    
        // Cleanup: evitar actualizar el estado si el componente se desmonta
        return () => {
          setLoading(false); // Asegurarse de limpiar el estado si se desmonta
        };
    }, [perfilId, token]);

    return (
        <>
            {error && (
                <ErrorPage {...error} />
            )}
            {!error && (<>
                <div className="mt-4">
                    <Card>
                        <CardTitulo>Perfil</CardTitulo>
                        <div className="p-5 mb-6 mt-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                {loading && (
                                    <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full w-20 h-20"></div>
                                )}
                                {!loading && perfil && (
                                    <img 
                                        src={`${host}${perfil.avatarThumbnail}`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = imageDefault; 
                                        }}
                                        onClick={() => {setModalActivo("imagen-perfil")}}
                                        alt="Perfil" 
                                        className="w-20 h-20 object-cover rounded-full select-none cursor-pointer"  
                                    />
                                )}
                               <div className="order-3 xl:order-2">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                        {perfil?.primerNombre} {perfil?.apellidos}
                                    </h4>
                                    <div className="flex flex-col items-start gap-1 xl:flex-row">
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-justify">
                                            {perfil?.username}
                                        </p>
                                        <div className="hidden w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {perfil?.email}
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
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Primer nombre */}
                                        <div>
                                            <p className="text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Primer nombre
                                            </p>
                                            {loading ? (
                                                <SkeletonElement className="min-w-[130px] md:min-w-[200px]" />
                                            ): (
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {perfil?.primerNombre}
                                                </p>
                                            )}
                                        </div>

                                        {/* Apellidos */}
                                        <div>
                                            <p className="text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Apellidos
                                            </p>
                                            {loading ? (
                                                <SkeletonElement />
                                            ): (
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {perfil?.apellidos}
                                                </p>
                                            )}
                                        </div>

                                        {/* Username */}
                                        <div>
                                            <p className="text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                Username
                                            </p>
                                            {loading ? (
                                                <SkeletonElement />
                                            ): (
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {perfil?.username}
                                                </p>
                                            )}
                                        </div>

                                        {/* E-mail */}
                                        <div>
                                            <p className="text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                E-mail
                                            </p>
                                            {loading ? (
                                                <SkeletonElement />
                                            ): (
                                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                    {perfil?.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>  
                {modalActivo === "imagen-perfil" && (
                    <ModalAbrirImagenPerfil 
                        cerrarModal={() => setModalActivo(null)}
                        usuario = {perfil}
                    />
                )}
            </>)}
        </>
    );
};

export default PerfilPagina;