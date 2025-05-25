import React, { useEffect, useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';
import { obtenerProducto } from '../services/productoServices';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { obtenerLote } from '@/pages/productos/services/loteServices';
import { formatDateCorte } from '@/utils/utilities';

const TituloInventarios = ({ productoId, loteId }) => {
  const { periodo } = useParams();
  const [lote, setLote] = useState();
  const [producto, setProducto] = useState();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fecthProducto = async () => {
      try {
        const res = await obtenerProducto(token, productoId);
        setProducto(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (!productoId) return;
    fecthProducto();
  }, [productoId, token]);

  useEffect(() => {
    const fetchLote = async () => {
      try {
        const res = await obtenerLote(token, loteId);
        setLote(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (!loteId) return;
    fetchLote();
  }, [loteId, token]);

  return (
    <h1 className="flex flex-wrap items-center text-xl font-bold my-3 h-auto gap-1">
      <Link to="/inventarios" className="hover:underline shrink-0">
        Kardex
      </Link>

      {periodo && (
        <>
          <LuChevronRight className="shrink-0" />
          <span className="shrink-0">{formatDateCorte(periodo)}</span>
        </>
      )}

      {periodo && producto && (
        <>
          <LuChevronRight className="shrink-0" />
          <Link
            to={`/inventarios/${periodo}/${productoId}`}
            className="flex items-center hover:underline min-w-0"
            title={producto?.nombre}
          >
            <span className="truncate max-w-[180px] sm:max-w-[250px] md:max-w-[320px]">
              {producto?.nombre}
            </span>
          </Link>
        </>
      )}

      {periodo && lote && (
        <>
          {lote?.productoNombre && (
            <>
              <LuChevronRight className="shrink-0" />
              <Link
                to={`/inventarios/${periodo}/${lote?.productoId}`}
                className="flex items-center hover:underline min-w-0"
                title={lote?.productoNombre}
              >
                <span className="truncate max-w-[180px] sm:max-w-[250px] md:max-w-[320px]">
                  {lote?.productoNombre}
                </span>
              </Link>
            </>
          )}

          <LuChevronRight className="shrink-0" />
          <span
            className="truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px]"
            title={lote?.numeroLote}
          >
            {lote?.numeroLote}
          </span>
        </>
      )}
    </h1>
  );
};


export default TituloInventarios;