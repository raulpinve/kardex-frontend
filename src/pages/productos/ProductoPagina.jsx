import React, { useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import { useParams } from 'react-router-dom';
import { obtenerProducto } from './services/productoServices';
import { useSelector } from 'react-redux';
import TarjetasInformacionStock from './components/producto/TarjetasInformacionStock';
import InformacionProducto from './components/producto/InformacionProducto';
import Lotes from './components/lotes/Lotes';
import GraficaComportamientoStock from '../../shared/components/GraficaComportamientoStock';

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
            <TarjetasInformacionStock {...{producto, loading, error}}/>
            <div className="grid w-full md:grid-cols-12 gap-6 mt-4">
                <InformacionProducto />
                <div className="col-span-8">
                    <GraficaComportamientoStock />
                </div>
            </div>
            <div className='mt-6'>
                <Lotes {...{tipo, productoId}} />
            </div>
        </Layout>
    );
};

export default ProductoPagina;