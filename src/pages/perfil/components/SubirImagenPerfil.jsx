import imageDefault from "../../../assets/image-default.png";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eliminarAvatar, subirAvatar } from "../services/perfilService";
import { actualizarAvatar } from "../../../store/authSlice";
import { host } from "../../../utils/config";
import { toast } from "sonner";
import { LuCamera, LuCloudUpload, LuRefreshCcw, LuTrash2 } from "react-icons/lu";

const SubirImagenPerfil = ({usuario, setModalActivo}) => {
    const [avatarPreview, setAvatarPreview] = useState(usuario.avatarThumbnail);
    const [subiendoAvatar, setSubiendoAvatar] = useState(false);
    const fileInputRef = useRef(null);
    const menuRef = useRef(null); 
    const [tieneImagen, setTieneImagen] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const toggleMenu = () => setMostrarMenu(!mostrarMenu);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    // Cambiar avatar
    const handleOpcionCambiar = () => {
        setMostrarMenu(false);
        fileInputRef.current.click();
    };

    // Eliminar avatar
    const handleOpcionEliminar = async () => {
        try {
            setSubiendoAvatar(true);
            setMostrarMenu(true);

            await eliminarAvatar(token);
            setAvatarPreview(imageDefault);

            toast.success("Avatar eliminado exitosamente.");
            setTieneImagen(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "No se pudo eliminar el avatar")            
        } finally {
            setMostrarMenu(false);
            setSubiendoAvatar(false);
        }
    };

    useEffect(() => {
        const verificarImagen = async () => {
            const url = `${host}/uploads/avatar-usuarios/${usuario.id}/${avatarPreview}`;
            try {
                const response = await fetch(url, { method: 'HEAD' });
                setTieneImagen(response.ok); // true si status 200
            } catch{
                setTieneImagen(false);
            }
        };
    
        if (avatarPreview) {
            verificarImagen();
        }
    }, [avatarPreview, usuario.id]);
    
        
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSubiendoAvatar(true);

        try {
            const respuesta = await subirAvatar(token, file);
            if (respuesta?.archivo) {
                setAvatarPreview(respuesta.archivo.miniatura);

                // Actualizar en el store (lo que hace que el header también cambie)
                dispatch(actualizarAvatar({
                    avatarThumbnail: respuesta.archivo.miniatura, 
                    avatar: respuesta.archivo.original
                }));
            }
        } catch (error){
            toast.error(error?.response?.data?.message || "No se pudo cambiar la imagen de perfil. Por favor, inténtalo de nuevo.");
        } finally {
            setSubiendoAvatar(false);
        }
    };

    // Administrar dropdown apertura y cierre
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMostrarMenu(false);
            }
        };
        if (mostrarMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mostrarMenu]);

    return (
        <div className="relative group w-20 h-20">
            {/* Imagen de perfil */}
            <img 
                src={`${host}/uploads/avatar-usuarios/${usuario.id}/${avatarPreview}`}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = imageDefault; 
                }}
                onClick={() => { setModalActivo("imagen-perfil") }}
                alt="Perfil" 
                className="w-full h-full object-cover rounded-full select-none cursor-pointer" 
            />

            {/* Botón de cámara: visible solo al hacer hover sobre el contenedor */}
            <button 
                className="opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 absolute bottom-0 right-0 p-[7px] bg-blue-700 dark:bg-gray-700 text-white rounded-full cursor-pointer"
                onClick={toggleMenu}
            >
                <LuCamera />
            </button>


            {/* Indicador de carga */}
            {subiendoAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* Dropdown de opciones */}
            {mostrarMenu && (
                <div 
                    ref={menuRef}
                    className="absolute top-[100%] left-[50%] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg w-[150px]"
                >
                    <button
                        onClick={handleOpcionCambiar}
                        className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full cursor-pointer"
                    >
                        {tieneImagen ? (
                            <>
                                <LuRefreshCcw className="mr-2" /> Cambiar avatar
                            </>
                        ) : (
                            <>
                                <LuCloudUpload className="mr-2" /> Subir avatar
                            </>
                        )}
                    </button>
                    {tieneImagen && (
                        <button
                            onClick={handleOpcionEliminar}
                            className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full cursor-pointer"
                        >
                            <LuTrash2 className="mr-2" /> Eliminar avatar
                        </button>
                    )}
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
        );
};

export default SubirImagenPerfil;