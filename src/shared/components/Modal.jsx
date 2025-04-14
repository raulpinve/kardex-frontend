import React, { useEffect, useRef, useState } from 'react';
import { LuX } from 'react-icons/lu';

const Modal = (props) => {
     const {
        isOpenModal,
        setIsOpenModal,
        children,
        title = "Advertencia",
        zIndex = "z-100",
        showAgreeButton = false,
        description= null,
        onClose,
        position = "center",
        size = "lg",
        allowClose = true // Controla si la modal se puede cerrar tanto con clic afuera como en la "X"
    } = props; 

    const [shake, setShake] = useState(false);
    const modalRef = useRef(null); // Referencia para el contenedor del modal

    let sizePixels =
        size === "sm"
            ? "md:w-[350px]"
            : size === "md"
            ? "md:w-[500px]"
            : size === "lg"
            ? "lg:w-[700px]"
            : size === "xl"
            ? "xl:w-[1000px]"
            : size === "2xl"
            ? "2xl:w-[1200px]"
            : "";

    const onCloseModal = () => {
        setIsOpenModal();
        if (onClose) onClose(); // Ejecuta el callback de cierre si existe
    };

    const handleCloseAttempt = () => {
        if (allowClose) {
            onCloseModal();
        } else {
            triggerShake();
        }
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500); // Quita el temblor después de 500ms
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && allowClose && isOpenModal) {
                onCloseModal();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [allowClose, isOpenModal]);

    const handleMouseDown = (e) => {
        // Comprueba si el clic comienza fuera del contenedor del modal
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            e.target.dataset.clickedOutside = "true";
        }
    };
    const handleMouseUp = (e) => {
        // Comprueba si el clic terminó fuera del contenedor del modal
        if (e.target.dataset.clickedOutside === "true") {
            handleCloseAttempt();
        }
    };

    if (!isOpenModal) return null;

    return (
        <div 
            className={`fixed inset-0 h-full w-full bg-gray-400/50 dark:bg-gray-800/50 backdrop-blur-[26px] ${zIndex} flex items-${position} justify-center p-4 md:p-0`}
            onMouseDown={handleMouseDown} // Detecta el inicio del clic
            onMouseUp={handleMouseUp} // Detecta el final del clic
        >
            <div 
                ref={modalRef} // Asigna la referencia al contenedor del modal
                className={`no-scrollbar relative w-full ${sizePixels}  rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 ${shake ? "shake" : ""}`}
            >
                {/* Header de la modal */}
                <div>
                    {/* Close button */}
                    {allowClose && (
                        <button 
                            className='transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center 
                                    rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 
                                    dark:bg-gray-700  dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300 cursor-pointer'
                            onClick={handleCloseAttempt}
                        >
                            <LuX />
                        </button>
                    )}
                   
                    {/* Título */}
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h4>
                    {/* Descripción */}
                    {description && 
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            {description}
                        </p>
                    }
                </div>

                {/* Cuerpo de la modal */}
                <div className='text-gray-700 dark:text-gray-200'>
                    {children}
                </div>
                {showAgreeButton && (
                    <div className="flex justify-center items-center w-full px-4 pb-4">
                        <button className="button-form button-form-primary" onClick={onCloseModal}>
                            Aceptar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;