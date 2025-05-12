import { useState, useEffect, useRef } from 'react';
import { LuFileCheck2, LuSettings, LuTrash2 } from 'react-icons/lu';
import Button from '../../../../shared/components/Button';
import ModalCerrarCorte from './ModalCerrarCorte';
import ModalEliminarCorte from './ModalEliminarCorte';

const DropdownEditarCorte = () => {
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
      setIsOpen(null)
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
          className={`absolute w-[170px] p-3 bg-white border border-gray-200 top-[40px] right-0 rounded-lg mt-2 shadow-lg dark:border-gray-800 z-90
          transition-all duration-300 ease-in-out transform text-sm dark:bg-gray-900 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          <button 
            className='p-2 cursor-pointer w-full text-left flex gap-2 items-center' onClick={() => setModalActivo("cerrar-corte")}
          >
              <LuFileCheck2 /> Cerrar corte
          </button>
          <button 
          className='text-red-600 p-2 cursor-pointer w-full text-left flex gap-2 items-center'
            onClick={() => setModalActivo("eliminar-corte")}
          >
              <LuTrash2 /> Eliminar corte
          </button>
        </div>
        {modalActivo === "cerrar-corte" && (
          <ModalCerrarCorte 
            cerrarModal={() => setModalActivo(null)}
          />
        )}
        {modalActivo === "eliminar-corte" && (
          <ModalEliminarCorte 
            cerrarModal={() => setModalActivo(null)}
          />
        )}
      </div>
    </>
  );
};

export default DropdownEditarCorte;
