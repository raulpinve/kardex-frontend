import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { obtenerListadoAlmacenes } from '../services/almacenesServices';
import { obtenerListadoUsuarios } from '../services/usuariosServices';
import Card from './Card';
import { confirmarDesbloqueoSuscripcion } from '../services/suscripcionServices';
import { setPendienteDesbloqueo } from '@/store/suscripcionSlice';
import { useNavigate } from 'react-router-dom';

const limites = {
    basico:   { almacenes: 3, usuarios: 10},
    estandar: { almacenes: 5, usuarios: 20},
    premium:  { almacenes: 15, usuarios: 30}
};

const SeleccionarAlmacenesUsuariosBloqueados = () => {
    const { plan } = useSelector(state => state.suscripcion.suscripcion);
    const owner = useSelector(state => state.auth.usuario);
    const limiteEmpresas = limites[plan].almacenes;
    const limiteUsuarios = limites[plan].usuarios;
    const [almacenes, setAlmacenes] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [almacenesActivos, setAlmacenesActivos] = useState([]);
    const [usuariosActivos, setUsuariosActivos] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggle = (id, setter, values, max) => {
        if (values.includes(id)) {
            setter(values.filter(v => v !== id));
        } else if (values.length < max) {
            setter([...values, id]);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resAlmacenes = await obtenerListadoAlmacenes();
                const resUsuarios = await obtenerListadoUsuarios();
                setAlmacenes(resAlmacenes.data);
                setUsuarios(resUsuarios.data);

                // Owner siempre activo y no removible
                setUsuariosActivos([owner.id]);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [owner.id]);

    const handleGuardar = async () => {
        setLoading(true);
        try {
            await confirmarDesbloqueoSuscripcion({
                empresas: almacenesActivos,
                usuarios: usuariosActivos
            });

            dispatch(setPendienteDesbloqueo(false));
            toast.success('Recursos actualizados correctamente');
            navigate("/mi-plan");

        } catch (err) {
            console.error(err);
            toast.error('Error al confirmar selección');
        } finally {
            setLoading(false);
        } 
    };

    return (
        <Card className={`mx-auto mt-8 max-w-[850px]`}>
            <div className="space-y-6 text-sm dark:text-gray-200">
                <p className='font-semibold text-lg'>
                    Has realizado un cambio de plan. Selecciona los usuarios y almacenes que
                    deseas mantener activos.
                </p>

                {/* ALMACENES */}
                <section>
                    <h3 className="font-semibold mb-2">Almacenes ({almacenesActivos.length}/{limiteEmpresas})</h3>
                    <ul className="space-y-1">
                        {almacenes.map(e => (
                            <li
                                key={e.id}
                                onClick={() =>
                                    toggle(e.id, setAlmacenesActivos, almacenesActivos, limiteEmpresas)
                                }
                                className={`p-2 border border-gray-200 dark:border-gray-800 rounded cursor-pointer select-none
                                    ${almacenesActivos.includes(e.id)
                                        ? 'bg-blue-100 dark:bg-blue-950 dark:text-white border-blue-500'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {e.nombre}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* USUARIOS */}
                <section>
                    <h3 className="font-semibold mb-2"> Usuarios ({usuariosActivos.length}/{limiteUsuarios})</h3>
                    <ul className="space-y-1">
                        {usuarios.map(u => {
                            const esOwner = u.id === owner.id;
                            const seleccionado = usuariosActivos.includes(u.id);

                            return (
                                <li
                                    key={u.id}
                                    onClick={() =>
                                        !esOwner &&
                                        toggle(u.id, setUsuariosActivos, usuariosActivos, limiteUsuarios)
                                    }
                                    className={`p-2 border border-gray-200 dark:border-gray-800 rounded cursor-pointer select-none
                                        ${
                                            seleccionado
                                            ? 'bg-blue-100 dark:bg-blue-950 dark:text-white border-blue-500'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                                        }
                                        ${
                                            esOwner
                                            ? 'bg-gray-200 font-semibold cursor-not-allowed'
                                            : 'cursor-pointer'
                                        }`}
                                    >
                                    {u.primerNombre} {u.apellidos}
                                    {esOwner && ' (Propietario)'}
                                </li>
                            );
                        })}
                    </ul>
                </section>
                
                <div className="flex">
                    <button
                        disabled={loading}
                        onClick={handleGuardar}
                        className=" px-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        Confirmar selección
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default SeleccionarAlmacenesUsuariosBloqueados;