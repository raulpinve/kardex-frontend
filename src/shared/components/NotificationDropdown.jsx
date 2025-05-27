import { useState, useRef, useEffect } from "react";
import { LuBell } from "react-icons/lu";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";
import { obtenerNotificaciones } from "../services/notificacionesServices";
import imageDefault from '../../assets/image-default.png';
import { host } from "@/utils/config";
import { Link } from "react-router-dom";
import { tiempoRelativoCreativo } from "@/utils/utilities";
import ReactMarkdown from 'react-markdown';

const NotificationDrawer = () => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const token = useSelector(state => state.auth.token);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [loading, setLoading] = useState(false);

    // Animación apertura/cierre
    useEffect(() => {
        if (isOpen) {
            setNotificaciones([]); 
            setPaginaActual(1); // Reiniciar página al abrir
            const timeout = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timeout);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    // Cargar notificaciones cada vez que cambia paginaActual o se abre el drawer
    useEffect(() => {
        const fetchNotificaciones = async () => {
            if (!isOpen || !almacenId) return;

            setLoading(true);
            try {
                const res = await obtenerNotificaciones(token, almacenId, paginaActual);
                
                // Acceso correcto a datos según respuesta de la API
                const nuevasNotificaciones = res.data.data || res.data; // ajustar según cómo venga tu API
                const paginacion = res.paginacion || {};

                if (paginaActual === 1) {
                    setNotificaciones(nuevasNotificaciones);
                } else {
                    setNotificaciones(prev => [...prev, ...nuevasNotificaciones]);
                }
                setTotalPaginas(paginacion.totalPaginas || 1);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotificaciones();
    }, [paginaActual, isOpen, almacenId, token]);

    const closeDrawer = () => {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 300);
    };
    const hayMas = paginaActual < totalPaginas;

    return (
        <>
            {/* Botón campana */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative cursor-pointer w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
                <LuBell />
                <span className="absolute top-0 right-0 w-2 h-2 bg-orange-400 rounded-full animate-ping" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-orange-400 rounded-full" />
            </button>

            {/* Drawer */}
            {(isOpen || isVisible) && (
                <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
                    <div
                        onClick={closeDrawer}
                        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 backdrop-blur-xs ${
                            isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0'
                        }`}
                    />
                    <div
                        className={`relative w-[420px] h-full bg-white dark:bg-gray-900 shadow-xl p-4 flex flex-col transform transition-transform duration-300 pointer-events-auto ${
                            isVisible ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Notificaciones
                            </h2>
                            <button
                                onClick={closeDrawer}
                                className="text-sm text-gray-500 dark:text-gray-400 hover:underline cursor-pointer"
                            >
                                Cerrar ✕
                            </button>
                        </div>

                        <div
                            className="overflow-y-auto flex-1 pr-1 custom-scrollbar"
                            style={{ maxHeight: "calc(100vh - 100px)" }}
                        >
                            <ul>
                                {notificaciones.map((notificacion) => (
                                    <li key={notificacion.id}>
                                        <Link
                                            to={`/${notificacion.recurso}s/${notificacion.recursoId}`}
                                            className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 min-w-[40px] min-h-[40px]">
                                                <img
                                                    src={`${host}${notificacion.avatarThumbnail}`}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = imageDefault;
                                                    }}
                                                    alt={notificacion.user}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="text-sm pl-4">
                                                <div className="text-gray-700 dark:text-gray-300">
                                                    <span className="font-medium">{notificacion.user}</span>{" "}
                                                    <ReactMarkdown>{notificacion.mensaje}</ReactMarkdown>{" "}
                                                    <span className="font-medium">{notificacion.project}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">{tiempoRelativoCreativo(notificacion.createdAt)}</p>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {loading && <Spinner className="mx-auto mt-4" />}

                            {/* Botón cargar más */}
                            {!loading && hayMas && (
                                <button
                                    onClick={() => setPaginaActual(prev => prev + 1)}
                                    className="mt-3 w-full cursor-pointer text-sm flex justify-center rounded-lg border border-gray-300 bg-white p-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                                >
                                    Cargar más
                                </button>
                            )}

                            {!hayMas && (
                                <p className="text-center text-gray-700 dark:text-gray-500 mt-2 text-sm">No hay más notificaciones</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NotificationDrawer;
