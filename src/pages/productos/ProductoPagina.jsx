import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import { useParams } from 'react-router-dom';
import { obtenerProducto } from './services/productoServices';
import { useSelector } from 'react-redux';
import TarjetasInformacionStock from './components/producto/TarjetasInformacionStock';
import InformacionProducto from './components/producto/InformacionProducto';
import Lotes from './components/lotes/Lotes';
import GraficaComportamientoStock from '../../shared/components/GraficaComportamientoStock';
import TituloProductos from './components/shared/TituloProductos';

const ProductoPagina = ({ tipo }) => {
    const {productoId} = useParams();
    const [error, setError] = useState();
    const [producto, setProducto] = useState();
    const [loading, setLoading] = useState(false);
    const token= useSelector(state => state.auth.token);

    // Obtener información del producto
    useEffect(() => {
        const fetchProducto = async () => {
            setLoading(true);
            try {
                const respuesta = await obtenerProducto(token,productoId);
                setProducto(respuesta.data)
            } catch (error) {
                setError(error?.response?.data?.message || "Ha ocurrido un error interno. Por favor, inténtalo nuevamente.");
            } finally {
                setLoading(false);
            }
        }
        if(productoId){
            fetchProducto();
        }
    },[productoId, token])

    return (
        <Layout>
            <TituloProductos productoId={productoId}/>
            <TarjetasInformacionStock productoId={productoId}/>
            <div className="grid w-full md:grid-cols-12 gap-4 mt-4">
                <div className='col-span-12 xl:col-span-4 2xl:col-span-3'>
                    <InformacionProducto />
                </div>
                <div className="min-w-0 col-span-12 xl:col-span-8 2xl:col-span-9 grid xl:gap-4 2xl:gap-6">
                    <GraficaComportamientoStock />
                </div>
            </div>
            <div className='mt-6'>
                <Lotes tipo={tipo} productoId={productoId} />
            </div>
        </Layout>
    );
};

export default ProductoPagina;