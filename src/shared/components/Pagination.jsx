import React, { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const Pagination = ({ paginaActual, totalPaginas, onPageChange }) => {
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

    return (
        <nav className="flex items-center text-sm">
            <button
                onClick={() => onPageChange(paginaActual - 1)}
                disabled={paginaActual === 1}
                className={`px-3 py-2 text-gray-500 hover:text-gray-700 cursor-pointer ${paginaActual === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
               <LuChevronLeft />
            </button>
            {generarPaginacion().map((pagina, index) => (
                <button
                    key={index}
                    onClick={() => {
                        if (pagina === "left-dots") setExpandirIzquierda(true);
                        else if (pagina === "right-dots") setExpandirDerecha(true);
                        else if (typeof pagina === "number") onPageChange(pagina);
                    }}
                    className={`px-3 py-2 cursor-pointer ${paginaActual === pagina ? " text-blue-600  dark:text-white/70 " : "text-gray-500 hover:text-gray-700"}`}
                >
                    {pagina === "left-dots" || pagina === "right-dots" ? "..." : pagina}
                </button>
            ))}
            <button
                onClick={() => onPageChange(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
                className={`px-3 py-2 text-gray-500 hover:text-gray-700 cursor-pointer ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}`}
            >
               <LuChevronRight />
            </button>
        </nav>
    );
};

export default Pagination;

// Ejemplo de como se usa

/*
import React, { useState, useEffect } from "react";
import Pagination from "./Pagination"; // Importa el componente

const DispositivosList = () => {
    const [dispositivos, setDispositivos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // Función para obtener los datos desde el backend
    const fetchDispositivos = async (pagina) => {
        try {
            const response = await fetch(`https://api.tuservicio.com/dispositivos?pagina=${pagina}`);
            const data = await response.json();

            setDispositivos(data.data); // Ajusta según la estructura del backend
            setPaginaActual(data.paginacion.paginaActual);
            setTotalPaginas(data.paginacion.totalPaginas);
        } catch (error) {
            console.error("Error al obtener los dispositivos:", error);
        }
    };

    // Cargar dispositivos cuando cambie la página
    useEffect(() => {
        fetchDispositivos(paginaActual);
    }, [paginaActual]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Lista de Dispositivos</h2>
            <ul>
                {dispositivos.map((dispositivo) => (
                    <li key={dispositivo.id} className="border p-2 mb-2 rounded">
                        {dispositivo.nombre}
                    </li>
                ))}
            </ul>

            {/* Componente de paginación 
            <Pagination
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onPageChange={setPaginaActual}
            />
        </div>
    );
};

export default DispositivosList;

*/