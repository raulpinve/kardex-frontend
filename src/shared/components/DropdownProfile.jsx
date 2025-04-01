import React, { useState, useEffect, useRef } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { LuCircleUser, LuSettings2, LuLogOut } from 'react-icons/lu';

const DropdownProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button className="flex items-center cursor-pointer focus:outline-none" onClick={toggleDropdown}>
        <img 
          src="https://img.freepik.com/foto-gratis/hombre-sonriente-guapo-tomando-selfie_176420-18045.jpg" 
          alt="Perfil" 
          className="w-10 h-10 object-cover rounded-full ml-1 mr-3"  
        />
        <div className="flex items-center">
          <p className="font-medium text-sm">Raulpinve</p>
          <RiArrowDropDownLine className={`text-xl transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
        </div>
      </button>

      {/* Dropdown content */}
      <div 
        className={`absolute w-[260px] p-3 bg-white border border-gray-200 top-[40px] right-0 rounded-lg mt-2 shadow-lg 
        transition-all duration-300 ease-in-out transform dark:bg-slate-900 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <h3 className="font-medium text-sm text-gray-600 dark:text-gray-200">Raúl Velásquez</h3>
        <h4 className="text-sm text-gray-500 dark:text-gray-200">raulvelasquezpinto@gmail.com</h4>

        <ul className="mt-1 border-b border-gray-200 mb-2 py-2 text-gray-600 dark:text-gray-200 text-md">
          <li className="header-profile-li">
            <LuCircleUser />
            <span>Editar perfil</span>
          </li>

          <li className="header-profile-li">
            <LuSettings2 />
            <span>Configuración</span>
          </li>
        </ul>

        <button className="header-profile-li">
          <LuLogOut />
          <span>Salir</span>
        </button>
      </div>
    </div>
  );
};

export default DropdownProfile;
