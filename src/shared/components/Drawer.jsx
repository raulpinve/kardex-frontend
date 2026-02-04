import { LuCircleX, LuX } from "react-icons/lu";
import Button from "./Button";
import { useEffect } from "react";

const Drawer = ({ children, isOpen, onClose }) => {

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKey);
    }

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay suavizado */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.25)] backdrop-blur-md z-60"
          onClick={onClose}
        ></div>
      )}

        {/* Drawer */}
        <div
            className={`fixed top-0 right-0 w-full md:w-[450px] lg:w-[40%] h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white transform transition-transform z-60 shadow-lg
            ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="flex items-center justify-center pt-4">
                <button
                    onClick={onClose}
                    className="rounded-full p-3 bg-gray-100 dark:bg-gray-800 cursor-pointer"
                    type="button"
                >
                    <LuX />
                </button>
            </div>
            <div className="p-8">{children}</div>
        </div>
    </>
  );
};

export default Drawer;
