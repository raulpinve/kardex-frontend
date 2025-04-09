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
            <div className="flex text-gray-700 dark:text-gray-400">
                <div className="w-full md:w-[700px] mx-auto mt-4">
                    <Card>
                        <div>
                            <CardTitulo>Seleccionar almacén</CardTitulo>
                            <p className='text-sm'>Para continuar, por favor selecciona un almacén: </p>
                        </div>
                        <div className='grid grid-cols-3 gap-4 mt-5 text-sm'>
                            {/* Loading  */}
                            {loading && <>{
                                [...Array(5)].map((_,index) => <div key={index} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl h-[70px] mb-3">
                                </div>)
                            }</>}
                            {/* Mostrando contenido */}
                            {!loading && (
                                <>
                                    {almacenes.map(almacen => (
                                    <button 
                                        key={almacen.id} 
                                        className="bg-white p-4 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer"
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