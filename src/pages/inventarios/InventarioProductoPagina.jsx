import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import TarjetasInformacionStock from './components/productos/TarjetasInformacionStock';
import InventarioLotes from './components/productos/InventarioLotes';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { obtenerCortePeriodo } from './services/cortesServices';
import InformacionProducto from '../productos/components/producto/InformacionProducto';
import Corte from './components/cortes/Corte';
import TituloInventarios from './components/TitleSelect';

const InventarioProductoPagina = () => {
    const almacenId = useSelector(state => state.almacen.almacen?.id);
    const [ corte, setCorte ] = useState();
    const token = useSelector(state => state.auth.token);
    const {periodo, productoId} = useParams();
    const [error, setError] = useState();

    // Obtener información del corte
    useEffect(() => {
        const fetchCorte = async () => {
            try {
                const res = await obtenerCortePeriodo(token, periodo, almacenId);
                setCorte(res.data);
            } catch (error){
                setError(error?.response?.data?.message || "Error al obtener el corte.");
            }
        }
        if(!periodo || !almacenId) return;
        fetchCorte()    

    }, [periodo, token, almacenId])

    return (
        <Layout>
            <div className='py-2'>
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                    <TituloInventarios productoId={productoId} />
                    <div className="flex items-center gap-2">
                        <div className="flex gap-2">
                            <Corte />
                        </div>
                    </div>
                </div>
            </div>
            <TarjetasInformacionStock corteId={corte?.id} productoId={productoId}/> 
           
            <div className="grid w-full md:grid-cols-12 gap-6 mt-4 items-start">
                <InformacionProducto />
                <div className="min-w-0 col-span-12 xl:col-span-8 2xl:col-span-8 grid xl:gap-4 2xl:gap-6">
                    <div className='grid'>
                        <InventarioLotes corteId={corte?.id} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default InventarioProductoPagina;