import React, { useEffect, useState } from 'react';
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
    const tabs = ["Usuarios", "Almacenes", "Categorías"];

    // Leer activeTab de localStorage al inicio (o usar "Almacenes" por defecto)
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeTab') || "Usuarios";
    });

    useEffect(() => {
        if(usuario?.rol !== "superadmin"){
            navigate("/");
        } else {
            setLoading(false);
        }
    }, [usuario, navigate]);

    // Guardar activeTab en localStorage cada vez que cambie
    useEffect(() => {
        localStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    if(loading) return null;

    return (<>
        <Title>Configuración</Title>  
        <div className="flex gap-2 my-6">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition cursor-pointer
                        ${
                        activeTab === tab
                            ? "bg-blue-600 dark:bg-gray-700 text-white shadow"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-600"
                        }
                        dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-gray-800
                    `}
                >
                    {tab}
                </button>
            ))}
        </div>
        {/* Contenido */}
        <div>
            {activeTab === "Almacenes" && <Almacenes />}
            {activeTab === "Categorías" && <Categorias />}
            {activeTab === "Usuarios" && <Usuarios />}
        </div>
    </>);
};

export default ConfiguracionPage;
