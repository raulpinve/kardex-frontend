import imageDefault from "../../../assets/image-default.png";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subirAvatar } from "../services/perfilService";
import { actualizarAvatar } from "../../../store/authSlice";
import { host } from "../../../utils/config";
import { toast } from "sonner";
import { LuCamera } from "react-icons/lu";

const SubirImagenPerfil = ({usuario, setModalActivo}) => {
    const [avatarPreview, setAvatarPreview] = useState(usuario.avatarThumbnail);
    const [subiendoAvatar, setSubiendoAvatar] = useState(false);
    const fileInputRef = useRef(null);

    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

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

    return (
        <div className="relative">
            <button 
                className="absolute p-1.5 bottom-0 right-0 text-sm bg-blue-700 dark:bg-gray-700 text-white rounded-full  cursor-pointer transition"
                onClick={handleImageClick}
            >
                <LuCamera />
            </button>
            <img 
                src={`${host}/uploads/avatar-usuarios/${usuario.id}/${avatarPreview}`}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = imageDefault; 
                }}
                onClick={() => {setModalActivo("imagen-perfil")}}
                alt="Perfil" 
                className="w-20 h-20 object-cover rounded-full select-none cursor-pointer"  
            />
            {subiendoAvatar && (
                <div className="absolute w-20 h-20 left-0 inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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