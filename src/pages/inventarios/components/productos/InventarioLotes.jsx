import React, { useEffect, useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import { LuArrowLeftRight, LuSearch } from 'react-icons/lu';
import Pagination from '../../../../shared/components/Pagination';
import { useNavigate, useParams } from 'react-router-dom';
import { obtenerCorteLotes } from '../../services/cortesServices';
import { useSelector } from 'react-redux';
import SkeletonTable from '../../../../shared/components/SkeletonTable';
import useDebounce from '../../../../shared/hooks/useDebounce';
import { dateColombiaFormat, obtenerEstadoVencimiento } from '@/utils/utilities';
import ModalCrearMovimiento from '@/pages/productos/components/movimientos/ModalCrearMovimiento';

const InventarioLotes = ({ corte, corteId, setRefreshStock, setRefreshMovimientos }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [consulta, setConsulta] = useState("");
  const [lotes, setLotes] = useState([]);
  const token = useSelector(state => state.auth.token);
  const [modalMovimientoActivo, setModalMovimientoActivo] = useState(false);
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);

  const navigate = useNavigate();
  const { productoId, periodo } = useParams();
  const debouncedConsulta = useDebounce(consulta, 500);

  useEffect(() => {
    const fetchCorteLote = async () => {
      setLoading(true);
      try {
        const respuesta = await obtenerCorteLotes(token, corteId, productoId, paginaActual, consulta);
        if (respuesta.data) {
          setLotes(respuesta.data);
          setPaginaActual(respuesta.paginacion.paginaActual);
          setTotalPaginas(respuesta.paginacion.totalPaginas);
          setError(null);
        }
      } catch (error) {
        setError(error?.response?.data?.message || "Ha ocurrido un error interno. Por favor, inténtalo nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    if (corteId && productoId) {
      fetchCorteLote();
    }
  }, [corteId, productoId, token, debouncedConsulta, consulta, paginaActual]);

  const redireccionar = (loteId) => {
    navigate(`/inventarios/${periodo}/${loteId}/lote`);
  };

  // Actualiza stock localmente en la lista de lotes
  const actualizarLote = (loteId, tipo, cantidad) => {
    setLotes((prevLotes) =>
      prevLotes.map((lote) => {
        if (lote.id !== loteId) return lote;
        const nuevoStock =
          tipo === "entrada"
            ? lote.stockDisponible + Number(cantidad)
            : lote.stockDisponible - Number(cantidad);
        return { ...lote, stockDisponible: nuevoStock };
      })
    );
    setRefreshStock(prev => prev + 1);
    setRefreshMovimientos(prev => prev + 1)
  };

  return (
    <Card className={`h-full flex flex-col`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <CardTitulo>Lotes</CardTitulo>
        <div className="flex gap-1 items-center justify-between">
          <div className="relative hidden md:block">
            <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
            <input
              type="text"
              placeholder="Buscar..."
              className="input-form pl-10 dark:bg-gray-900"
              value={consulta}
              onChange={(e) => setConsulta(e.currentTarget.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="min-w-0 flex-grow">
        <div className="overflow-x-auto w-full">
          <table className="mt-3 min-w-max w-full text-gray-700 dark:text-gray-200">
            <thead className='sticky top-0 bg-white dark:bg-gray-800'>
              <tr className="border-gray-100 border-y text-sm dark:border-gray-800 text-left">
                <th className="py-3 px-4">
                    <p className="font-medium text-gray-700 dark:text-gray-400">Número de lote</p>
                </th>
                <th className="py-3 px-4">
                    <p className="font-medium text-gray-700 dark:text-gray-400">Registro sanitario</p>
                </th>
                <th className="py-3 px-4 min-w-[120px]">
                    <p className="font-medium text-gray-700 dark:text-gray-400">Fecha de vencimiento</p>
                </th>
                <th className="py-3 px-4">
                    <p className="font-medium text-gray-700 dark:text-gray-400">Stock disponible</p>
                </th>
                {!corte?.cerrado && (
                  <th className="py-3 px-4">
                    <p className="font-medium text-gray-700 dark:text-gray-400">Acciones</p>
                  </th>
                )}
              </tr>
            </thead>
            {loading && <SkeletonTable rows={7} columns={5} />}
                <tbody className="text-sm">
                    {!loading && error && (
                        <tr>
                            <td colSpan="5" className="py-3 px-4 text-center text-gray-700 dark:text-gray-400">
                                {error}
                            </td>
                        </tr>
                    )}
                    {!loading && !error && lotes.length === 0 && (
                        <tr>
                            <td colSpan="5" className="py-3 px-4 text-center text-gray-700 dark:text-gray-400">
                                No hay lotes por mostrar.
                            </td>
                        </tr>
                    )}
                    {!loading && !error && lotes.length > 0 && lotes.map((lote) => {
                        const { estado, color } = obtenerEstadoVencimiento(lote.fechaVencimiento);
                        return (
                            <tr
                                key={lote.id}
                                className="cursor-pointer text-sm"
                                onClick={() => redireccionar(lote.id)}
                            >
                                <td className="py-3 px-4">{lote.numeroLote}</td>
                                <td className="py-3 px-4">{lote.registroSanitario}</td>
                                <td className="py-3 px-4 lg:flex lg:gap-2 items-center">
                                    <p>{dateColombiaFormat(lote.fechaVencimiento)}</p>
                                    <p className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${color}`}>
                                        {estado}
                                    </p>
                                </td>
                                <td className="py-3 px-4">{lote.stockDisponible}</td>
                                {!corte?.cerrado && (
                                  <td className="py-3 px-4 flex gap-2">
                                      <button
                                          title="Registrar movimiento"
                                          className="cursor-pointer p-1"
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              setLoteSeleccionado(lote);
                                              setModalMovimientoActivo(true);
                                          }}
                                      >
                                          <LuArrowLeftRight />
                                      </button>
                                  </td>
                                )}
                            </tr>
                        );
                    })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <Pagination
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onPageChange={setPaginaActual}
      />

      {/* Modal para crear movimiento */}
      {modalMovimientoActivo && loteSeleccionado && (
        <ModalCrearMovimiento
          cerrarModal={() => setModalMovimientoActivo(false)}
          loteId = {loteSeleccionado?.id}
          lote={loteSeleccionado}
          actualizarLote={actualizarLote}
        />
      )}
    </Card>
  );
};

export default InventarioLotes;
