import React, { useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';

const InformacionProducto = (props) => {
    // const {medicamento, setMedicamento, loading, error} = props;
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const [producto, setProducto] = useState({
        nombre: "Adrenalina",
        formaFarmaceutica: "Solución inyectable",
        concentracion: "1mg/ml", 
        presentacionComercial: "Ampolla",
        unidadMedida: "mg/ml", 
        stockRequerido: 5, 
        tipo: "medicamento", 
        serie: 4, 
        riesgo: "IIA"
    })

    return (
        // <div className="text-sm text-gray-700 dark:text-gray-400 col-span-12 lg:col-span-3">
            <Card className={`text-sm text-gray-700 dark:text-gray-400 col-span-12 xl:col-span-3`}>
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
                        <CardTitulo className="text-center">{producto.nombre}</CardTitulo>
                        <img 
                            src={`https://picsum.photos/100?${Math.random()}`}
                            alt="Imagen de perfil del medicamento" 
                            className="w-10 h-10 object-cover rounded-full select-none cursor-pointer"  
                        />
                    </div>

                    <div className='my-5'>
                        {/* Forma farmaceutica */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Forma farmacéutica
                            </span>
                            <span className="text-right text-theme-sm">
                                Ampolla
                            </span>
                        </div>

                        {/* Concentración */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Concentración
                            </span>
                            <span className="text-right text-theme-sm">
                                1mg/ml
                            </span>
                        </div>

                        {/* Presentación */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Presentación
                            </span>
                            <span className="text-right text-theme-sm">
                                Ampolla
                            </span>
                        </div>

                        {/* Unidad médica */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Unidad médica
                            </span>
                            <span className="text-right text-theme-sm">
                                mg/ml
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 hidden">
                        {producto?.tipo === "medicamento" && (<>
                            {/* Forma farmacéutica */}
                            <div>
                                <p>Forma farmacéutica</p>
                                <p className="font-semibold">{producto.formaFarmaceutica}</p>
                            </div>

                            {/* Concentración */}
                            <div className="mt-4">
                                <p>Concentración</p>
                                <p className="font-semibold">{producto.concentracion}</p>
                            </div>

                            {/* Presentación */}
                            <div className="mt-4">
                                <p>Presentación</p>
                                <p className="font-semibold">{producto.presentacionComercial}</p>
                            </div>

                            {/* Unidad de médica */}
                            <div className="mt-4">
                                <p>Unidad médica</p>
                                <p className="font-semibold">{producto.unidadMedida}</p>
                            </div>
                        </>)}

                        {/* Presentacion comercial */}
                        {producto?.tipo === "dispositivo" && (<>
                            <div>
                                <p>Presentacion comercial</p>
                                <p className="font-semibold">{producto.presentacionComercial}</p>
                            </div>

                            {/* Serie */}
                            <div className="mt-4">
                                <p>Serie</p>
                                <p className="font-semibold">{producto.serie}</p>
                            </div>

                            {/* Riesgo */}
                            <div className="mt-4">
                                <p>Riesgo</p>
                                <p className="font-semibold">{producto.riesgo}</p>
                            </div>
                        </>)}
                    </div>
                </>)}
            </Card>
        // </div>
    );
};

export default InformacionProducto;