import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import { obtenerAlmacenes } from '../../pages/configuracion/services/almacenService';
import { setAlmacen } from '../../store/almacenSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { LuLogOut } from 'react-icons/lu';

const SeleccionarAlmacen = () => {
    const almacen = useSelector(state => state.almacen.almacen);
    const usuario = useSelector(state => state.auth.usuario);
    const token = useSelector(state => state.auth.token);
    const [validandoAlmacen, setValidandoAlmacen] = useState(true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [almacenes, setAlmacenes] = useState([]);
    const location = useLocation();
    const dispatch = useDispatch();

    // const rutasSinModal = ['/configuracion', '/otra-ruta-opcional'];
    // const enRutaExcluida = rutasSinModal.includes(location.pathname);
    const navigate = useNavigate();

    useEffect(() => {
        const validarAlmacenGuardado = async () => {
            setLoading(true);
            try {
                const almacenLocal = localStorage.getItem('almacenSeleccionado');
                const res = await obtenerAlmacenes(token);
                setAlmacenes(res.data);

                if (almacenLocal) {
                    const almacenParseado = JSON.parse(almacenLocal);
                    const almacenActualizado = res.data.find(a => a.id === almacenParseado.id);

                    if (almacenActualizado) {
                        dispatch(setAlmacen(almacenActualizado));
                        localStorage.setItem('almacenSeleccionado', JSON.stringify(almacenActualizado));
                        return;
                    }

                    localStorage.removeItem('almacenSeleccionado');
                    dispatch(setAlmacen(null));
                }

                setIsOpenModal(true);
            } catch (error) {
                console.error('Error al validar almacén:', error);
                setIsOpenModal(true);
            } finally {
                setValidandoAlmacen(false);
                setLoading(false);
            }
        };

        validarAlmacenGuardado();
    }, [dispatch, token]);
    
    // Este useEffect está bien si se necesita que el modal se cierre automáticamente cuando se elige un almacén desde otro componente
    useEffect(() => {
        setIsOpenModal(!almacen);
    }, [almacen]);
    
    return (
        !validandoAlmacen && !almacen && (
            // !validandoAlmacen && !almacen && !enRutaExcluida && (
            <Modal
                isOpenModal={isOpenModal}
                setIsOpenModal={() => setIsOpenModal(false)}
                title="Seleccionar almacén"
                size="md"
                allowClose= { false }
            >
                <div className='grid gap-4 mt-5 text-sm'>
                    {/* Loading  */}
                    {loading && <>{
                        [...Array(5)].map((_,index) => <div key={index} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl h-[20px] mb-3">
                        </div>)
                    }</>}
                    {/* Mostrando contenido */}
                    {!loading && (<>
                        {almacenes.length === 0 ? (
                            <div className="text-sm">
                                {usuario.rol === "superadmin" ? (<>
                                    <p className="mb-4">No tienes almacenes creados. Crea uno para comenzar.</p>
                                    <button 
                                        onClick={() => {
                                            navigate('/configuracion'); // Ajustá esta ruta si es distinta
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                        Crear almacén
                                    </button>
                                </>) : (<>
                                    <p className="mb-4">No tienes acceso a ningún almacén. Pídele a tu administrador que cree uno nuevo o que te otorgue permisos para acceder a uno existente.</p>
                                    <button 
                                        onClick={() => {
                                            dispatch(logout())
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
                                    >
                                        <LuLogOut />
                                        Cerrar sesión
                                    </button>
                                </>)}
                            </div>
                        ) : (
                            <>
                                <p className='text-sm'>Por favor selecciona un almacén para continuar. </p>
                                {almacenes.map(almacen => (
                                    <p 
                                        key={almacen.id} 
                                        className="dark:bg-gray-900 cursor-pointer hover:font-medium select-none"
                                        onClick={() => {
                                            localStorage.setItem('almacenSeleccionado', JSON.stringify(almacen));
                                            dispatch(setAlmacen(almacen));

                                            const primerSegmento = location.pathname.split('/')[1]; // te da 'medicamentos', 'configuracion', etc.
                                            navigate(`/${primerSegmento}`);
                                        }}
                                    >
                                        {almacen.nombre}
                                    </p>
                                ))}
                        </>) 
                        } 
                    </>) 
                    }
                </div>
            </Modal>
        )
    );
};

export default SeleccionarAlmacen;