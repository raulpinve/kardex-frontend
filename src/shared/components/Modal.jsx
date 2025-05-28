import React, { useEffect, useRef, useState } from 'react';
import { LuX } from 'react-icons/lu';

const Modal = (props) => {
    const {
        isOpenModal,
        setIsOpenModal,
        children,
        title = "Advertencia",
        zIndex = "z-90",
        showAgreeButton = false,
        description = null,
        onClose,
        position = "center",
        size = "lg",
        allowClose = true
    } = props;

    const [shake, setShake] = useState(false);
    const modalRef = useRef(null);

    let sizePixels =
        size === "sm"
            ? "sm:w-[350px]"
            : size === "md"
            ? "md:w-[700px]"
            : size === "lg"
            ? "lg:w-[800px]"
            : size === "xl"
            ? "xl:w-[1000px]"
            : size === "2xl"
            ? "2xl:w-[1200px]"
            : "";

    const onCloseModal = () => {
        setIsOpenModal();
        if (onClose) onClose();
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
        setTimeout(() => setShake(false), 500);
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
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            e.target.dataset.clickedOutside = "true";
        }
    };

    const handleMouseUp = (e) => {
        if (e.target.dataset.clickedOutside === "true") {
            handleCloseAttempt();
        }
    };

    if (!isOpenModal) return null;

    return (
        <div 
            className={`fixed inset-0 h-full w-full bg-gray-400/50 dark:bg-gray-800/50 backdrop-blur-[26px] ${zIndex} flex items-${position} justify-center p-4 md:p-6`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div 
                ref={modalRef}
                className={`no-scrollbar relative w-full ${sizePixels} max-h-[90vh] overflow-hidden rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11 ${shake ? "shake" : ""} flex flex-col`}
            >
                {/* Header */}
                <div>
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

                    <h4 className="text-2xl p-2 font-semibold text-gray-800 dark:text-white/90">
                        {title}
                    </h4>
                    {description && 
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 lg:mb-2 px-2">
                            {description}
                        </p>
                    }
                </div>

                {/* Body con scroll */}
                <div className="overflow-y-auto grow text-gray-700 dark:text-gray-200 p-2">
                    {children}
                </div>

                {/* Botón (si aplica) */}
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
