import React from 'react';
import Layout from '../../shared/components/Layout';
import Title from '../../shared/components/Title';
import Usuarios from './components/usuarios/Usuarios';
import Almacenes from './components/almacenes/Almacenes';

const ConfiguracionPage = () => {
    return (
        <Layout>
            <Title>Configuración</Title>      
            <div>
                <Almacenes />
                <Usuarios />
            </div>
        </Layout>
    );
};

export default ConfiguracionPage;