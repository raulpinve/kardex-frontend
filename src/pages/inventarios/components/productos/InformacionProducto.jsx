import React, { useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import MessageError from '../../../../shared/components/MessageError';
import { host } from '../../../../utils/config';
import imageDefault from "../../../../assets/image-default.png";
import SkeletonElement from '../../../../shared/components/SkeletonElement';
import ModalAbrirImagenPerfil from '../../../../shared/components/ModalAbrirImagenPerfil';

const InformacionProducto = (props) => {
    const {producto, loading, error} = props;
    const [modalActivo, setModalActivo] = useState();
    const [urlImage, setUrlImage] = useState(null);
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
                {!loading && producto && ( <>
                    <div className='flex items-center mt-2 justify-between'>
                        <CardTitulo> {producto.nombre} </CardTitulo>
                        <img 
                            src={`${host}${producto.avatarThumbnail}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = imageDefault; 
                            }}
                            alt="Imagen de perfil del medicamento" 
                            className="w-10 h-10 object-cover rounded-full select-none cursor-pointer" 
                            onClick={() => {
                                setUrlImage(producto.avatar)
                                setModalActivo("imagen-perfil");
                            }} 
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
                    urlImage = {urlImage}
                    tipo = {producto?.tipo}
                />
            )}
        </>
    );
};

export default InformacionProducto;