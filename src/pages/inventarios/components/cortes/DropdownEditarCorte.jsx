import { useState, useEffect, useRef } from 'react';
import { LuArchive, LuBookCheck, LuBookLock, LuDoorClosed, LuFileLock, LuLock, LuLogOut, LuSettings, LuTrash2 } from 'react-icons/lu';
import Button from '../../../../shared/components/Button';

const DropdownEditarCorte = () => {
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
        <Button 
            onClick={toggleDropdown}
            colorButton={`secondary`}
        >
        <LuSettings />
      </Button>

      {/* Dropdown content */}
      <div 
        className={`absolute w-[170px] p-3 bg-white border border-gray-200 top-[40px] right-0 rounded-lg mt-2 shadow-lg dark:border-gray-800 z-90
        transition-all duration-300 ease-in-out transform text-sm dark:bg-gray-900 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <button className='p-2 cursor-pointer w-full text-left flex gap-2 items-center'>
            <LuBookCheck /> Cerrar corte
        </button>
        <button className='text-red-600 p-2 cursor-pointer w-full text-left flex gap-2 items-center'>
            <LuTrash2 /> Eliminar corte
        </button>
      </div>
    </div>
  );
};

export default DropdownEditarCorte;
