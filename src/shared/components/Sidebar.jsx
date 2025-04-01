import React from 'react';
import { LuLayoutDashboard, LuSettings, LuSyringe } from "react-icons/lu";
import { useSelector } from "react-redux";
import { LuPill } from "react-icons/lu";

const Sidebar = () => {
    const sidebarOpen = useSelector((state) => state.sidebar.sidebarOpen);
    return (
        <aside 
            className={`fixed lg:static bg-white flex flex-col left-0 top-0 h-screen z-50 border-r border-gray-200 transition-all duration-300 dark:bg-gray-900 dark:text-gray-200
            ${sidebarOpen ? "w-[290px] px-5" : "lg:w-[67px] px-2"}
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
            <nav className="flex flex-col gap-3 text-gray-600 text-md font-medium dark:text-gray-200">
                {/* Título de Menú */}
                <h3 className="mb-2 text-xs uppercase leading-[20px] text-gray-400">
                    <p className={`${sidebarOpen? "text-left" : "text-center"}`}>MENÚ</p>
                </h3>
                
                {/* Dashboard */}
                <div className="sidebar-li active">
                    <LuLayoutDashboard className="text-xl min-w-[24px]" />
                    <span className={`transition-all duration-200 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Dashboard
                    </span>
                </div>
                
                {/* Medicamentos */}
                <div className="sidebar-li">
                    <LuPill className="text-xl min-w-[24px]" />
                    <span className={`transition-all duration-200 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Medicamentos
                    </span>
                </div>

                {/* Dispositivos */}
                <div className="sidebar-li">
                    <LuSyringe className="text-xl min-w-[24px]" />
                    <span className={`transition-all duration-200 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Dispositivos
                    </span>
                </div>

                {/* Configuración */}
                <div className="sidebar-li">
                    <LuSettings className="text-xl min-w-[24px]" />
                    <span className={`transition-all duration-200 ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                        Configuración
                    </span>
                </div>
            </nav>
    </aside>
    );
};

export default Sidebar;   