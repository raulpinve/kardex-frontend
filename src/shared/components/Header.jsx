import React from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';
import { RiMenu2Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/sidebarSlice';
import DropdownProfile from './DropdownProfile';
import { useDarkMode } from "../hooks/useDarkMode"; 
import { deleteAlmacen } from '../../store/almacenSlice';
import SearchDropdown from './SearchDropdown';
import NotificationDropdown from './NotificationDropdown';
import { useLocation } from 'react-router-dom';
import AlertasVencimiento from './AlertasVencimiento';

const Header = () => {
    const dispatch = useDispatch();
    const { darkMode, toggleDarkMode } = useDarkMode();
    const location = useLocation();
    const almacen = useSelector(state => state.almacen.almacen);

    return (
        <header className="sticky top-0 w-full border-b border-gray-200 z-50 bg-white px-3 lg:px-0 dark:bg-gray-900 bg- dark:text-gray-200 dark:border-gray-800 transition-colors">
        <div className="flex grow  items-center justify-between lg:px-6 py-3">
          <div className="flex items-center">
            {/* Menú hamburguesa */}
            <button 
                onClick={() => dispatch(toggleSidebar())} 
                className="w-10 h-10 border border-gray-200 dark:border-gray-800 rounded-lg mr-2 flex items-center justify-center relative text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200  cursor-pointer"
              >
                <RiMenu2Fill />
            </button>

            {/* Search input */}
            <SearchDropdown />
          </div>

          {/* Profile, modo nocturno y notificaciones */}
          <div className="flex justify-between items-center gap-2">
             {/* Nombre almacén */}
              <h3 className={`text-xs uppercase leading-[20px] text-gray-500 font-medium ellipsis select-none cursor-pointer`}>
                {almacen?.nombre && location.pathname !== "/configuracion" && (
                      <p
                        onClick={() => {
                          localStorage.removeItem('almacenSeleccionado');
                          dispatch(deleteAlmacen());
                        }}
                      >{almacen.nombre}</p>
                  )}
              </h3>

            {/* Botón de Modo Nocturno */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 border border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center relative text-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200  cursor-pointer"
            >
              {darkMode ? <LuMoon /> : <LuSun />}
            </button>

            {/* Bell */}
            {almacen?.nombre && location.pathname !== "/configuracion" && (
              <NotificationDropdown />
            )}
            {almacen?.nombre && location.pathname !== "/configuracion" && (
              <AlertasVencimiento/>
            )}
            {/* Profile */}
            <DropdownProfile />
          </div>
        </div>
      </header>
    );
};

export default Header;