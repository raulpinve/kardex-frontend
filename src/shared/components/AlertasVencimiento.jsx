import { useState, useEffect } from "react";
import { LuTriangleAlert } from "react-icons/lu";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";
import { obtenerAlertasVencimiento } from "../services/loteServices";
import Badge from "./Badge";

const AlertasVencimiento = () => {
  const almacenId = useSelector(state => state.almacen.almacen?.id);
  const almacen = useSelector(state => state.almacen?.almacen);
  const token = useSelector(state => state.auth.token);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [alertas, setAlertas] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [loading, setLoading] = useState(false);

  // Carga alertas al montar o al cambiar almacen/token, sin necesidad de abrir el drawer
  useEffect(() => {
    const fetchAlertasInicial = async () => {
      if (!almacenId || !token) return;
      setLoading(true);
      try {
        const res = await obtenerAlertasVencimiento(token, almacenId, 1);
        const nuevasAlertas = res.data.data || res.data;
        setAlertas(nuevasAlertas);
        setTotalPaginas(res.paginacion?.totalPaginas || 1);
        setPaginaActual(1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertasInicial();
  }, [almacenId, token]);

  // Controla animación y visibilidad del drawer
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Carga más alertas cuando cambias de página y el drawer está abierto
  useEffect(() => {
    const fetchAlertasPagina = async () => {
      if (!isOpen || paginaActual === 1 || !almacenId || !token) return;
      setLoading(true);
      try {
        const res = await obtenerAlertasVencimiento(token, almacenId, paginaActual);
        const nuevasAlertas = res.data.data || res.data;
        setAlertas(prev => [...prev, ...nuevasAlertas]);
        setTotalPaginas(res.paginacion?.totalPaginas || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertasPagina();
  }, [paginaActual, isOpen, almacenId, token]);

  const closeDrawer = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  const hayMas = paginaActual < totalPaginas;

  const cantidadAlertasCriticas = alertas.filter(alerta => 
    alerta.estado === 'Vencido' || 
    alerta.estado === 'Por vencer (crítico)' || 
    alerta.estado === 'Por vencer (moderado)'
  ).length;

  return (
    <>
      {/* Botón para abrir el drawer */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative cursor-pointer w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Alertas de vencimiento"
      >
        <LuTriangleAlert />
        {cantidadAlertasCriticas > 0 && (
          <>
            <span className="absolute top-0.5 -right-0.5 w-2 h-2 bg-orange-400 rounded-full animate-ping" />
            <span className="absolute top-0.5 -right-0.5 w-2 h-2 bg-orange-400 rounded-full" />
          </>
        )}
      </button>

      {/* Drawer */}
      {(isOpen || isVisible) && (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
          <div
            onClick={closeDrawer}
            className={`fixed inset-0 bg-black/40 transition-opacity duration-300 backdrop-blur-xs ${
              isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0'
            }`}
          />
          <div
            className={`relative w-[420px] h-full bg-white dark:bg-gray-900 shadow-xl p-4 flex flex-col transform transition-transform duration-300 pointer-events-auto ${
              isVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Alertas de Vencimiento</h2>
                {almacen?.nombre && <span className="text-gray-600 text-sm relative -top-1">{almacen.nombre}</span>}
              </div>
              <button
                onClick={closeDrawer}
                className="text-gray-500 dark:text-gray-400 hover:underline cursor-pointer text-2xl"
              >
                ✕
              </button>
            </div>

            <div
              className="overflow-y-auto flex-1 pr-1 custom-scrollbar"
              style={{ maxHeight: "calc(100vh - 100px)" }}
            >
              <ul>
                {alertas.map(alerta => (
                  <li
                    key={alerta.loteId}
                    className="flex justify-between p-4 mb-2 rounded-lg border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <p className="font-semibold">Lote: {alerta.numeroLote}</p>
                      <p className="mt-1">Producto: {alerta.producto}</p>
                      <p>Stock: <span>{alerta.stockActual}</span></p>
                      <p>
                        Vence: <time dateTime={alerta.fechaVencimiento}>{new Date(alerta.fechaVencimiento).toLocaleDateString()}</time>
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <Badge 
                        tipo={
                          alerta.estado === 'Vencido' ? 'danger' :
                          (alerta.estado === 'Por vencer (crítico)' || alerta.estado === 'Por vencer (moderado)') ? 'warning' :
                          'success'
                        }
                      >
                        {alerta.estado}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>

              {loading && <Spinner className="mx-auto mt-4" />}

              {!loading && hayMas && (
                <button
                  onClick={() => setPaginaActual(prev => prev + 1)}
                  className="mt-3 w-full cursor-pointer text-sm flex justify-center rounded-lg border border-gray-300 bg-white p-3 font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
                >
                  Cargar más
                </button>
              )}

              {!hayMas && (
                <p className="text-center text-gray-700 dark:text-gray-500 mt-2 text-sm">No hay más alertas</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertasVencimiento;
