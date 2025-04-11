import React, { useState, useEffect, useRef } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { LuCircleUser, LuSettings2, LuLogOut } from 'react-icons/lu';
import { logout } from '../../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const DropdownProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const usuario = useSelector(state => state.auth.usuario);

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
          src="https://picsum.photos/50" 
          alt="Perfil" 
          className="w-10 h-10 object-cover rounded-full ml-1 mr-3"  
        />
        <div className="flex items-center">
            <p className="font-medium text-sm">{usuario?.username}</p>
          <RiArrowDropDownLine className={`text-xl transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
        </div>
      </button>

      {/* Dropdown content */}
      <div 
        className={`absolute w-[260px] p-3 bg-white border border-gray-200 top-[40px] right-0 rounded-lg mt-2 shadow-lg dark:border-gray-800 
        transition-all duration-300 ease-in-out transform dark:bg-gray-900 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <h3 className="font-medium text-sm text-gray-600 dark:text-white/90">{usuario?.primerNombre} {usuario?.apellidos}</h3>
        <h4 className="text-sm text-gray-500 dark:text-white/90">{usuario?.email}</h4>

        <ul className="mt-1 border-b border-gray-200 mb-2 py-2 text-gray-600 dark:text-white/90 text-md dark:border-gray-800">
          <Link 
            to={`/perfil`}
            className="header-profile-li">
            <LuCircleUser />
            <span>Editar perfil</span>
          </Link>
        </ul>

        <button 
          className="header-profile-li"
          onClick={() => {
            dispatch(logout())
          }}
        >
          <LuLogOut />
          <span>Salir</span>
        </button>
      </div>
    </div>
  );
};

export default DropdownProfile;
