import React from 'react';
import Layout from '../../shared/components/Layout';
import Title from '../../shared/components/Title';
import Usuarios from './components/usuarios/Usuarios';

const ConfiguracionPage = () => {
    return (
        <Layout>
            <Title>Configuración</Title>      
            <div className='grid grid-cols-[1.2fr_1fr] gap-3'>
                <Usuarios />
            </div>
        </Layout>
    );
};

export default ConfiguracionPage;