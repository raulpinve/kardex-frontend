import React from 'react';
import Layout from '../../shared/components/Layout';
import Title from '../../shared/components/Title';
import Usuarios from './components/usuarios/Usuarios';
import Almacenes from './components/almacenes/Almacenes';
import Categorias from './components/categorias/Categorias';

const ConfiguracionPage = () => {
    return (
        <Layout>
            <Title>Configuración</Title>      
            <div>
                <div className="grid gap-4 2xl:grid-cols-2">
                    <Categorias />
                    <Almacenes />
                </div>
                <div className='mt-4'>
                    <Usuarios />
                </div>
            </div>
        </Layout>
    );
};

export default ConfiguracionPage;