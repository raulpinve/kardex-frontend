import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import SkeletonElement from "./SkeletonElement";
import useDebounce from "../hooks/useDebounce";
import { toast } from "sonner";
import { obtenerProductos } from "../services/productoServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { host } from "@/utils/config";

export default function SearchDropdown() {
  const [consulta, setConsulta] = useState("");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);  // Nuevo estado
  const containerRef = useRef(null);
  const token = useSelector((state) => state.auth.token);
  const almacenId = useSelector((state) => state.almacen.almacen?.id);
  const debouncedConsulta = useDebounce(consulta, 500);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setConsulta(value);
    setDropdownVisible(true); // Mostrar dropdown al escribir

    if (value.trim().length === 0) {
      setProductos([]);
      setLoading(false);
      setDropdownVisible(false); // Ocultar dropdown si no hay texto
      return;
    }
  };

  const handleSelect = (item) => {
    const { tipo, id } = item;
    navigate(`/${tipo}s/${id}`);
    setConsulta("");
    setProductos([]);
    setDropdownVisible(false); // Ocultar dropdown al seleccionar
  };

  // Cerrar al hacer clic fuera y ocultar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setProductos([]);
        setConsulta("");
        setDropdownVisible(false); // Ocultar dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const res = await obtenerProductos(token, almacenId, debouncedConsulta);
        setProductos(res.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Ha ocurrido un error al intentar obtener la información");
      } finally {
        setLoading(false);
      }
    };

    if (!debouncedConsulta) return;
    fetchProductos();
  }, [debouncedConsulta, token, almacenId]);

  return (
    <div ref={containerRef} className="relative hidden sm:block w-96">
      <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-400" />
      <input
        type="text"
        value={consulta}
        onChange={handleChange}
        placeholder="Buscar medicamentos o dispositivos..."
        className="input-form pl-10 w-full dark:bg-gray-900"
      />

      {loading && dropdownVisible && (
        <div className="absolute z-10 mt-1 w-full text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-72 overflow-auto divide-y divide-gray-100 dark:divide-gray-700">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[30px_1fr] px-4 py-3 items-center w-full gap-4"
            >
              <SkeletonElement className="w-[35px] h-[35px] rounded-full" />
              <div>
                <SkeletonElement className="w-[70%] h-[22px]" />
                <SkeletonElement className="w-[50%] h-[15px] mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && dropdownVisible && productos.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-72 overflow-auto divide-y divide-gray-100 dark:divide-gray-700">
          {productos.map((producto) => (
            <li
              key={producto.id}
              onClick={() => handleSelect(producto)}
              className="cursor-pointer w-full px-4 py-3 flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <img
                src={`${host}${producto.avatarThumbnail}`}
                alt={producto.nombre}
                className="w-[35px] h-[35px] rounded-full object-cover"
              />
              <div>
                <p className="font-medium">
                  {producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{producto.tipo}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && dropdownVisible && debouncedConsulta.trim() !== "" && consulta.trim() !== "" && productos.length === 0 && (
        <div className="absolute text-sm z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow p-4 text-gray-500 text-center">
          No se encontraron resultados para <span className="font-semibold">"{debouncedConsulta}"</span>
        </div>
      )}
    </div>
  );
}
