import CardTitulo from '@/shared/components/CardTitulo';
import React, { useEffect, useState } from 'react';
import { LuChevronRight } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { obtenerProducto } from '../../services/productoServices';
import { obtenerLote } from '@/pages/lotes/services/loteServices';

const TituloProductos = ({ productoId, loteId }) => {
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
        <div className='py-2'>
            <CardTitulo className="flex items-center">
               {producto && (
                    <>
                        <Link to={`/${producto?.tipo}s`} className='capitalize'>
                            {producto?.tipo}s 
                        </Link>
                        <Link to={`/${producto?.tipo}s/${producto?.id}`} className='flex items-center'>
                            <LuChevronRight />
                            {producto?.nombre}
                        </Link>
                    </>
               )}
               {lote && (<>
                   {lote?.productoNombre && lote?.productoTipo && (
                        <>
                            <Link to={`/${lote?.productoTipo}s`} className='capitalize'>
                                {`${lote?.productoTipo}s`} 
                            </Link>
                            <Link to={`/${lote?.productoTipo}s/${lote?.productoId}`} className='flex items-center'>
                                <LuChevronRight />
                                {lote?.productoNombre}
                            </Link>
                        </>
                   )}
                   <span className='flex items-center'>
                       <LuChevronRight />
                       {lote?.numeroLote}
                   </span>
               </>)}
           </CardTitulo>
        </div>);
        
};

export default TituloProductos;