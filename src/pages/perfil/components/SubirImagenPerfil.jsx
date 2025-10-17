import imageDefault from "../../../assets/images/image-default.png";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { eliminarAvatar, subirAvatar } from "../services/perfilService";
import { actualizarAvatar } from "../../../store/authSlice";
import { host } from "../../../utils/config";
import { toast } from "sonner";
import { LuCamera, LuCloudUpload, LuRefreshCcw, LuTrash2 } from "react-icons/lu";

const SubirImagenPerfil = ({usuario, setModalActivo}) => {
    const [subiendoAvatar, setSubiendoAvatar] = useState(false);
    const fileInputRef = useRef(null);
    const menuRef = useRef(null); 
    const [tieneImagen, setTieneImagen] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const toggleMenu = () => setMostrarMenu(!mostrarMenu);

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
            toast.success("Avatar eliminado exitosamente.");
            setTieneImagen(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "No se pudo eliminar el avatar")            
        } finally {
            setMostrarMenu(false);
            setSubiendoAvatar(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSubiendoAvatar(true);

        try {
            const respuesta = await subirAvatar(token, file);
            if (respuesta?.data) {
                dispatch(actualizarAvatar({
                    avatarThumbnail: respuesta.data.avatarThumbnail, 
                    avatar: respuesta.data.avatar
                }));
            }
        } catch (error){
            const fieldErrors = error?.response?.data?.error?.fieldErrors;
            const message = Array.isArray(fieldErrors) && fieldErrors.length > 0
                ? fieldErrors[0].message
                : "No se pudo cambiar la imagen de perfil. Por favor, inténtalo de nuevo.";
            toast.error(message);

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

    const avatarUrl = `${host}${usuario.avatarThumbnail}&v=${Date.now()}`;

    return (
        <div className="relative group w-20 h-20">
            {/* Imagen de perfil */}
            <img 
                src={avatarUrl}
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
                    className="absolute top-[100%] left-0 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg w-[150px]"
                >
                    <button
                        onClick={handleOpcionCambiar}
                        className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full cursor-pointer"
                    >
                        {usuario?.avatarThumbnail ?  <>
                            <LuRefreshCcw className="mr-2" /> Cambiar avatar
                        </>
                        : <>
                            <LuCloudUpload className="mr-2" /> Subir avatar
                        </>} 
                    </button>
                    {usuario?.avatarThumbnail && (
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
        </div>);
};

export default SubirImagenPerfil;