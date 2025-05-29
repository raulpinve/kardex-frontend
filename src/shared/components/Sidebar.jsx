import React from 'react';
import { LuBox, LuSettings, LuSyringe } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { LuPill } from "react-icons/lu";
import { NavLink } from 'react-router-dom';
import { toggleSidebar } from '@/store/sidebarSlice';

const Sidebar = () => {
    const sidebarOpen = useSelector((state) => state.sidebar.sidebarOpen);
    const usuario = useSelector(state => state.auth.usuario);
    const dispatch = useDispatch();

    const handleSidebarLinkClick = () => {
        if (window.innerWidth < 1024) {
            dispatch(toggleSidebar())
        }
    };

    return (
        <aside 
            className={`fixed lg:static bg-white flex flex-col left-0 top-0 h-screen z-50 border-r border-gray-200 dark:border-gray-800
                transition-all duration-300 dark:bg-gray-900  text-gray-700 dark:text-white/90
            ${sidebarOpen ? "w-[240px] 2xl:w-[290px] px-5" : "lg:w-[67px] px-2"}
            ${sidebarOpen ? "translate-x-0" : "translate-x-[-100%] lg:translate-x-0"}`}
        >
            {/* Logo */}
            <div className="mt-13 lg:mt-0 pt-7 pb-6 flex items-center">
                <h2 className="font-semibold text-3xl transition-all duration-200">
                    { sidebarOpen 
                        ? "Kardex"
                        : <p className='px-3'>K</p>}
                </h2>
            </div>

            {/* Menú */}
            <nav className="flex flex-col gap-3 text-md font-medium text-gray-700 dark:text-white/90">
                {/* Título de Menú */}
                <h3 className={`mb-2 text-xs uppercase leading-[20px] hidden text-gray-400 ellipsis ${sidebarOpen? "text-left" : "text-center"}`}>
                    Menú
                </h3>
                
                {/* Dashboard */}
                <NavLink 
                    to="/inventarios"
                    onClick={handleSidebarLinkClick}
                    className={({ isActive }) => `sidebar-li ${isActive ? "active" : ""}`}
                >
                    <LuBox className="text-xl min-w-[24px]" />
                    <span className={`transition-all duration-200 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Kardex
                    </span>
                </NavLink>
                
                {/* Medicamentos */}
                <NavLink 
                    to="/medicamentos"
                    onClick={handleSidebarLinkClick}
                    className={({ isActive }) => `sidebar-li ${isActive ? "active" : ""}`}
                >
                    <LuPill className="text-xl min-w-[24px]" />
                    <span className={`transition-all duration-200 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Medicamentos
                    </span>
                </NavLink>

                {/* Dispositivos */}
                <NavLink 
                    to="/dispositivos"
                    onClick={handleSidebarLinkClick}
                    className={({ isActive }) => `sidebar-li ${isActive ? "active" : ""}`}
                >
                    <LuSyringe className="text-xl min-w-[24px]" />
                    <span className={`transition-all duration-200 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Dispositivos
                    </span>
                </NavLink>

                {/* Configuración */}
                {usuario?.rol === "superadmin" && (
                    <NavLink 
                        to="/configuracion"
                        onClick={handleSidebarLinkClick}
                        className={({ isActive }) => `sidebar-li ${isActive ? "active" : ""}`}
                    >
                        <LuSettings className="text-xl min-w-[24px]" />
                        <span className={`transition-all duration-200 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                            Configuración
                        </span>
                    </NavLink>
                )}
            </nav>
    </aside>
    );
};

export default Sidebar;   