import React, { useEffect, useState } from 'react';
import { obtenerAlmacenes } from '../configuracion/services/almacenService';
import { useSelector } from 'react-redux';
import Card from '../../shared/components/Card';
import CardTitulo from '../../shared/components/CardTitulo';
import Layout from '../../shared/components/Layout';
import { useNavigate } from 'react-router-dom';

const MedicamentoSeleccionarAlmacen = () => {
    const [loading, setLoading] = useState(false);
    const [almacenes, setAlmacenes] = useState([]);
    const token = useSelector(state => state.auth.token);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlmacenes = async () => {
            setLoading(true);
            try {
                const res = await obtenerAlmacenes(token);
                setAlmacenes(res.data)
            } catch (error) {
              console.error('Error al cargar almacenes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlmacenes()
    }, [])

    const seleccionarAlmacen = (id) => {
        navigate(`/medicamentos/${id}/almacen`);
    };

    return (
        <Layout>
            <div className="flex justify-center text-gray-700 dark:text-gray-400">
                <div className="w-full md:w-[500px]">
                    <Card>
                        <div>
                            <CardTitulo>Seleccionar almacén</CardTitulo>
                            <p className='text-sm'>Para continuar, por favor selecciona un almacén: </p>
                        </div>
                        <div className='mt-3 text-sm'>

                            {/* Loading  */}
                            {loading && <>{
                                [...Array(5)].map((_,index) => <div key={index} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[25px] mb-3">
                                </div>)
                            }</>}
                            {/* Mostrando contenido */}
                            {!loading && (
                                <>
                                    {almacenes.map(almacen => (
                                    <button 
                                        key={almacen.id} 
                                        className="block py-1 cursor-pointer hover:font-medium hover:text-black dark:hover:text-gray-400"
                                        onClick={() => seleccionarAlmacen(almacen.id)}
                                    >
                                        {almacen.nombre}
                                    </button>
                                    ))}
                                </>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default MedicamentoSeleccionarAlmacen;