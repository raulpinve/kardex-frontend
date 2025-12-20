import React, { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const Pagination = ({ paginaActual, totalPaginas, onPageChange, className }) => {
  const [expandirIzquierda, setExpandirIzquierda] = useState(false);
  const [expandirDerecha, setExpandirDerecha] = useState(false);

  const generarPaginacion = () => {
    let paginas = [];


    if (totalPaginas <= 7) {
      for (let i = 1; i <= totalPaginas; i++) {
        paginas.push(i);
      }
    } else {
      paginas.push(1);

      if (paginaActual > 3 && !expandirIzquierda) {
        paginas.push("left-dots");
      }

      let start = expandirIzquierda ? 2 : Math.max(2, paginaActual - 1);
      let end = expandirDerecha ? totalPaginas - 1 : Math.min(totalPaginas - 1, paginaActual + 1);

      for (let i = start; i <= end; i++) {
        paginas.push(i);
      }

      if (paginaActual < totalPaginas - 2 && !expandirDerecha) {
        paginas.push("right-dots");
      }

      paginas.push(totalPaginas);
    }

    return paginas;
  };
    if(totalPaginas < 2) return;

  
  return (
    <nav className={`flex items-center justify-between gap-2 px-4 py-3 sm:justify-normal ${className}`}>
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(paginaActual - 1)}
        disabled={paginaActual === 1}
        className={`flex items-center gap-2 rounded-md border cursor-pointer border-gray-300 bg-white p-1.5 text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 ${paginaActual === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <LuChevronLeft className="w-4 h-4" />
      </button>

      {/* Texto para móviles */}
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 sm:hidden">
        Página {paginaActual} de {totalPaginas}
      </span>

      {/* Paginación numerada */}
      <ul className="hidden items-center gap-1 sm:flex">
        {generarPaginacion().map((pagina, index) => (
          <li key={index}>
            <button
              onClick={() => {
                if (pagina === "left-dots") setExpandirIzquierda(true);
                else if (pagina === "right-dots") setExpandirDerecha(true);
                else if (typeof pagina === "number") onPageChange(pagina);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer
                ${
                  paginaActual === pagina
                    ? "bg-blue-600 dark:bg-gray-700 text-white hover:bg-blue-600"
                    : "text-gray-700 hover:bg-blue-600 hover:text-white dark:text-gray-400 dark:hover:text-white"
                }`}
            >
              {pagina === "left-dots" || pagina === "right-dots" ? "..." : pagina}
            </button>
          </li>
        ))}
      </ul>

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className={`flex items-center gap-2 cursor-pointer rounded-md border border-gray-300 bg-white p-1.5 text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <LuChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};

export default Pagination;
