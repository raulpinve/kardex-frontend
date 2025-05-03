import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { LuCamera, LuCloudUpload, LuRefreshCcw, LuTrash2 } from "react-icons/lu";
import { host } from "../../../../utils/config";
import imageDefault from "../../../../assets/image-default.png";
import ModalAbrirImagenPerfil from "../../../../shared/components/ModalAbrirImagenPerfil";
import { eliminarAvatar, subirAvatar } from "../../services/productoServices";

const SubirImagenProducto = ({producto, tipo, setProducto}) => {
    const [imageThumbnailSrc, setImageThumbnailSrc] = useState(imageDefault);
    const [imageSrc, setImageSrc] = useState(imageDefault);
    const [modalActivo, setModalActivo] = useState(false);
    
    const [subiendoAvatar, setSubiendoAvatar] = useState(false);
    const fileInputRef = useRef(null);
    const token = useSelector(state => state.auth.token);
    const menuRef = useRef(null); 
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

            await eliminarAvatar(token, tipo, producto.id);
            setProducto(prev => ({
                ...prev,
                avatar: null,
                avatarThumbnail: null
            }));
            toast.success("Avatar eliminado exitosamente.");
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "No se pudo eliminar el avatar")            
        } finally {
            setMostrarMenu(false);
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

    // Subir archivo al servidor
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSubiendoAvatar(true);
        try {
            const respuesta = await subirAvatar(token, tipo, producto.id, file);
            if(respuesta?.data?.avatarThumbnail){
                setProducto(prev => ({
                    ...prev,
                    avatar: respuesta.data.avatar,
                    avatarThumbnail: respuesta.data.avatarThumbnail
                }));
            }
        } catch (error){
            toast.error(error?.response?.data?.message || "No se pudo cambiar la imagen de perfil. Por favor, inténtalo de nuevo.");
        } finally {
            setSubiendoAvatar(false);
        }
    };
    useEffect(() => {
        setImageThumbnailSrc(producto.avatarThumbnail ? `${host}${producto.avatarThumbnail}`: imageDefault)
        setImageSrc(producto.avatar ? `${host}${producto.avatar}`: imageDefault)
    }, [producto.avatar, producto.avatarThumbnail])

    return (
        <div className="relative group w-12 h-12 my-1 group">
            <button 
                className="opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 duration-200  absolute p-[6px] -bottom-1 -right-1 text-xs bg-blue-700 dark:bg-gray-700 text-white rounded-full cursor-pointer transition"
                onClick={toggleMenu}
            >
                <LuCamera />
            </button>

            {/* Dropdown para editar y/o eliminar avatar */}
            {mostrarMenu && (
                <div 
                    ref={menuRef}
                    className="absolute top-[100%] right-0 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg w-[150px]"
                >
                    <button
                        onClick={handleOpcionCambiar}
                        className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full cursor-pointer"
                    >
                        {producto?.avatarThumbnail ?  <>
                            <LuRefreshCcw className="mr-2" /> Cambiar avatar
                        </>
                        : <>
                            <LuCloudUpload className="mr-2" /> Subir avatar
                        </>} 
                    </button>
                    {producto?.avatarThumbnail && (
                        <button
                            onClick={handleOpcionEliminar}
                            className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-full cursor-pointer"
                        >
                            <LuTrash2 className="mr-2" /> Eliminar avatar
                        </button>
                    )}
                </div>
            )}
            <img 
                src={imageThumbnailSrc}
                onClick={() => {
                    setModalActivo("imagen-perfil");
                }}
                alt="Imagen de perfil del medicamento" 
                className="w-12 h-12 object-cover rounded-full select-none cursor-pointer"  
            />

            {subiendoAvatar && (
                <div className="absolute w-12 h-12 left-0 inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            {modalActivo === "imagen-perfil" && (
                <ModalAbrirImagenPerfil 
                    cerrarModal={() => setModalActivo(null)}
                    urlImage={producto.avatar}
                    tipo={tipo === "medicamentos" ? "medicamento": "dispositivo"}
                />
            )} 
        </div>
    );
};
export default SubirImagenProducto;