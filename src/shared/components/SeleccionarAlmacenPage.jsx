import { obtenerAlmacenes } from '@/pages/configuracion/services/almacenService';
import { setAlmacen } from '@/store/almacenSlice';
import { logout } from '@/store/authSlice';
import React, { useEffect, useState } from 'react';
import { LuLogOut } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';

const SeleccionarAlmacenPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const usuario = useSelector(state => state?.auth?.usuario);
    const [almacenes, setAlmacenes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Cargar almacenes
    useEffect(() => {
        const fetchAlmacenes = async ()=> {
            try {
                const res = await obtenerAlmacenes();
                setAlmacenes(res.data);
            } catch (error) {
                console.error("Error al validar empresa: ", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAlmacenes();
    }, [dispatch])

    const from = location.state?.from || "/";
    const seleccionarAlmacen = (almacen) => {
        dispatch(setAlmacen(almacen));

        // Redirige a donde el usuario quería ir
        navigate(from, { replace: true });
    };

    return (
        <div className="grid gap-4 mt-10 mx-auto w-[850px] dark:text-gray-300">
            <h2 className='font-semibold text-2xl'>Seleccionar almacén: </h2>
            {loading && (
                [...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl h-[20px]"
                    />
                ))
            )}
    
            {!loading && (
                almacenes.length === 0 ? (
                    <div className="">
                        {usuario?.rol === 'superadmin' ? (
                            <>
                                <p className="mb-4">
                                    No tienes almacenes creados. Crea uno para comenzar.
                                </p>
                                <Button 
                                    textButton={`Crear almacén`}
                                    colorButton={`primary`}
                                    onClick={() => {
                                        navigate('/configuracion');
                                        localStorage.setItem('activeTab', 'Almacenes');
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <p className="mb-4">
                                    No tienes acceso a ningún almacén. Pídele a tu administrador
                                    que te otorgue permisos.
                                </p>
                                <button
                                    onClick={() => dispatch(logout())}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2 cursor-pointer"
                                >
                                    <LuLogOut />
                                    Cerrar sesión
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <div>
                    <p className="mb-2">
                        Por favor selecciona un almacén para continuar:
                    </p>
                    <ul className="space-y-2 divide-y divide-gray-200 dark:text-gray-300 ">
                        {almacenes.map(almacen => (
                            <li
                                key={almacen.id}
                                className="cursor-pointer hover:font-medium select-none py-1"
                                onClick={() => {
                                    seleccionarAlmacen(almacen)
                                    localStorage.setItem('almacenSeleccionado', JSON.stringify(almacen));
                                    dispatch(setAlmacen(almacen));
                                }}
                            >
                                {almacen.nombre}
                            </li>
                        ))}
                    </ul>
                    </div>
                )
            )}
        </div>
    );
};

export default SeleccionarAlmacenPage;