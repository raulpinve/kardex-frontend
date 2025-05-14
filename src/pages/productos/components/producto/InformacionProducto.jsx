import React, { useEffect, useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import MessageError from '../../../../shared/components/MessageError';
import SkeletonElement from '../../../../shared/components/SkeletonElement';
import ModalAbrirImagenPerfil from '../../../../shared/components/ModalAbrirImagenPerfil';
import SubirImagenProducto from './SubirImagenProducto';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { obtenerProducto } from '../../services/productoServices';

const InformacionProducto = () => {
    const {productoId} = useParams();
    const [loading, setLoading] = useState(false);
    const token = useSelector(state => state.auth.token);
    const [modalActivo, setModalActivo] = useState();
    const [producto, setProducto] = useState();
    const [error, setError] = useState();
    
    // Obtener información del producto
    useEffect(() => {
        const fetchProducto = async () => {
            setLoading(true);
            try {
                const res = await obtenerProducto(token, productoId);
                setProducto(res.data);
            } catch (error){
                setError(error?.response?.data?.message || "Error al obtener producto.");
            } finally{
                setLoading(false);
            }
        };

        if(!productoId) return;
        fetchProducto()
    },[productoId, token])
    return (
        <>
            <Card className={`text-sm text-gray-700 dark:text-gray-400 col-span-12 xl:col-span-4 `}>
                {/* Loading */}
                {loading && (<div>
                    <div className='flex items-center mt-2 justify-between'>
                        <SkeletonElement className="w-full max-w-[180px]"/>
                        <SkeletonElement className="w-[40px] h-[40px] rounded-full" />
                    </div>
                    <div className='mt-5'>
                        {   
                            [...Array(5)].map((_, index) => <SkeletonElement key={index} className="mb-2 h-[45px]"/>)
                        }
                    </div>
                </div>)}
                {!loading && error && <MessageError>{error}</MessageError>}
                {!loading && !error && producto && ( <>
                    <div className='flex items-center mt-2 justify-between'>
                        <CardTitulo> {producto.nombre} </CardTitulo>
                        <SubirImagenProducto 
                            producto={producto}
                            setProducto={setProducto}
                            tipo = {producto?.tipo}
                        />
                    </div>
                    <div className='my-5'>
                        {/* Tipo */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Tipo
                            </span>
                            <span className="text-right text-theme-sm capitalize">
                                {producto?.tipo}
                            </span>
                        </div>

                        {producto?.tipo === "medicamento" && (<>
                            {/* Forma farmaceutica */}
                            <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                                <span className="text-theme-sm">
                                    Forma farmacéutica
                                </span>
                                <span className="text-right text-theme-sm">
                                    {producto.formaFarmaceutica}
                                </span>
                            </div>

                            {/* Concentración */}
                            <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                                <span className="text-theme-sm">
                                    Concentración
                                </span>
                                <span className="text-right text-theme-sm">
                                    {producto.concentracion}
                                </span>
                            </div>

                            {/* Presentación */}
                            <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                                <span className="text-theme-sm">
                                    Presentación
                                </span>
                                <span className="text-right text-theme-sm">
                                    {producto.presentacionComercial}
                                </span>
                            </div>

                            {/* Unidad médica */}
                            <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                                <span className="text-theme-sm">
                                    Unidad médica
                                </span>
                                <span className="text-right text-theme-sm">
                                    {producto.unidadMedida}
                                </span>
                            </div>
                        </>)}

                        {producto?.tipo === "dispositivo" && (<>
                            {/* Presentación comercial */}
                            <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                                <span className="text-theme-sm">
                                    Presentacion comercial
                                </span>
                                <span className="text-right text-theme-sm">
                                    {producto.presentacionComercial}
                                </span>
                            </div>

                            {/* Serie */}
                            <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                                <span className="text-theme-sm">
                                    Serie
                                </span>
                                <span className="text-right text-theme-sm">
                                    {producto.serie}
                                </span>
                            </div>

                            {/* Riesgo */}
                            <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                                <span className="text-theme-sm">
                                    Riesgo
                                </span>
                                <span className="text-right text-theme-sm">
                                    {producto.riesgo}
                                </span>
                            </div>
                        </>)}

                        {/* Stock requerido */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Stock requerido
                            </span>
                            <span className="text-right text-theme-sm capitalize">
                                {producto?.stockRequerido}
                            </span>
                        </div>
                    </div>
                </>)}
            </Card>

            {modalActivo === "imagen-perfil" && (
                <ModalAbrirImagenPerfil 
                    cerrarModal={() => setModalActivo(null)}
                    tipo = {producto?.tipo}
                />
            )}
        </>
    );
};

export default InformacionProducto;