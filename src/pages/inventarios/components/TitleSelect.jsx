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
         <CardTitulo className="flex items-center">
            <Link to={`/inventarios`}>
                Inventarios 
            </Link>
            {periodo && producto && (
                <Link to={`/inventarios/${periodo}/${productoId}`} className='flex items-center'>
                    <LuChevronRight />
                    {producto?.nombre}
                </Link>
            )}
            {periodo && lote && (<>
                {lote?.productoNombre && (
                    <Link to={`/inventarios/${periodo}/${lote?.productoId}`} className='flex items-center'>
                        <LuChevronRight />
                        {lote?.productoNombre}
                    </Link>
                )}
                <Link className='flex items-center'>
                    <LuChevronRight />
                    {lote?.numeroLote}
                </Link>
            </>)}
        </CardTitulo>
    );
};

export default TituloInventarios;