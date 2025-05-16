import { useState, useEffect, useRef } from 'react';
import { LuFileCheck2, LuSettings, LuTrash2 } from 'react-icons/lu';
import Button from '../../../../shared/components/Button';
import ModalCerrarCorte from './ModalCerrarCorte';
import ModalEliminarCorte from './ModalEliminarCorte';

const DropdownEditarCorte = ({corteId}) => {
  const [modalActivo, setModalActivo] = useState(false);
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
      setIsOpen(null);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={`relative`} ref={dropdownRef}>
          <Button 
              onClick={toggleDropdown}
              colorButton={`secondary`}
          >
          <LuSettings />
        </Button>

        {/* Dropdown content */}
        <div 
          className={`absolute w-[170px] p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 top-[40px] right-0 rounded-lg mt-2 shadow-lg z-90
          transition-all duration-300 ease-in-out transform text-sm text-gray-700 dark:text-gray-200 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          <button 
            className='p-2 cursor-pointer w-full text-left flex gap-2 items-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md'
            onClick={() => setModalActivo("cerrar-corte")}
          >
            <LuFileCheck2 /> Cerrar corte
          </button>
          <button 
            className='text-red-600 dark:text-red-500 p-2 cursor-pointer w-full text-left flex gap-2 items-center hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md'
            onClick={() => setModalActivo("eliminar-corte")}
          >
            <LuTrash2 /> Eliminar corte
          </button>
        </div>

        {modalActivo === "cerrar-corte" && (
          <ModalCerrarCorte 
            corteId={corteId}
            cerrarModal={() => setModalActivo(null)}
          />
        )}
        {modalActivo === "eliminar-corte" && (
          <ModalEliminarCorte 
            corteId={corteId}
            cerrarModal={() => setModalActivo(null)}
          />
        )}
      </div>
    </>
  );
};

export default DropdownEditarCorte;
