import React, { use, useEffect, useState } from 'react';
import Layout from '../../shared/components/Layout';
import Title from '../../shared/components/Title';
import Usuarios from './components/usuarios/Usuarios';
import Almacenes from './components/almacenes/Almacenes';
import Categorias from './components/categorias/Categorias';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ConfiguracionPage = () => {
    const usuario = useSelector(state => state.auth.usuario);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if(usuario?.rol !== "superadmin"){
            navigate("/");
        }else{
            setLoading(false)
        }
    }, [usuario])

    if(loading) return
    return (
        <Layout>
            <Title>Configuración</Title>      
            <div className='mt-4'>
                <div className="grid gap-4 2xl:grid-cols-2">
                    <Almacenes />
                    <Categorias />
                </div>
                <div className='mt-4'>
                    <Usuarios />
                </div>
            </div>
        </Layout>
    );
};

export default ConfiguracionPage;