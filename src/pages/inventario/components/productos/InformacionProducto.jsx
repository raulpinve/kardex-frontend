import React from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import MessageError from '../../../../shared/components/MessageError';
import { host } from '../../../../utils/config';
import imageDefault from "../../../../assets/image-default.png";

const InformacionProducto = (props) => {
    const {producto, loading, error} = props;

    return (
        <Card className={`text-sm text-gray-700 dark:text-gray-400 col-span-12 xl:col-span-4 `}>
            {/* Loading */}
            {loading && (<div>
                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[25px] mb-3"></div>
                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg w-44 h-32 mx-auto my-5"></div>
                    {   
                        [...Array(5)].map((_,index) => <div key={index} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded h-[25px] mb-3"></div>)
                    }
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
                </div>
            </>)}
        </Card>
    );
};

export default InformacionProducto;