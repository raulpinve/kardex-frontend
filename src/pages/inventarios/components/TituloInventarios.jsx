import CardTitulo from '@/shared/components/CardTitulo';
import React, { useEffect, useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';
import { obtenerProducto } from '../services/productoServices';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { obtenerLote } from '@/pages/lotes/services/loteServices';

const TituloInventarios = ({ productoId, loteId }) => {
    const {periodo} = useParams();
    const [lote, setLote] = useState();
    const [producto, setProducto] = useState();
    const token = useSelector(state => state.auth.token);

    // Obtener la información del producto
    useEffect(() => {
        const fecthProducto = async () => {
            try {
                const res = await obtenerProducto(token, productoId);
                setProducto(res.data);
            } catch (error) {
                console.error(error);
            }
        }

        if(!productoId) return;
        fecthProducto()
    }, [productoId, token])

    // Obtener información del lote
    useEffect(() => {
        const fetchLote = async () => {
            try {
                const res = await obtenerLote(token, loteId);
                setLote(res.data)
            } catch (error) {
                console.error(error);
            }
        }
        if(!loteId) return;
        fetchLote();

    }, [loteId, token])

    return (
      <CardTitulo className="flex flex-wrap items-center gap-1 text-gray-700 dark:text-gray-200">
            <Link to="/inventarios" className="hover:underline text-gray-700 dark:text-gray-200">
                Inventarios
            </Link>

            {periodo && producto && (
                <Link
                to={`/inventarios/${periodo}/${productoId}`}
                className="flex items-center hover:underline text-gray-500 dark:text-gray-400"
                >
                <LuChevronRight className="mx-1 shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-xs">{producto?.nombre}</span>
                </Link>
            )}

            {periodo && lote && (
                <>
                {lote?.productoNombre && (
                    <Link
                    to={`/inventarios/${periodo}/${lote?.productoId}`}
                    className="flex items-center hover:underline text-gray-700 dark:text-gray-200"
                    >
                    <LuChevronRight className="mx-1 shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-xs">{lote?.productoNombre}</span>
                    </Link>
                )}

                <span className="flex items-center truncate max-w-[120px] sm:max-w-[150px] text-gray-500 dark:text-gray-400">
                    <LuChevronRight className="mx-1 shrink-0" />
                    {lote?.numeroLote}
                </span>
                </>
            )}
        </CardTitulo>
    );

};

export default TituloInventarios;