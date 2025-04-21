import React, { useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';

const InformacionLote = (props) => {
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
                    <div className='flex items-center mt-2 justify-between h-[40px]'>
                        <CardTitulo className="text-center">{producto.nombre}</CardTitulo>
                    </div>

                    <div className='my-5'>
                        {/* Numero de lote */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Número de lote
                            </span>
                            <span className="text-right text-theme-sm">
                                23045299
                            </span>
                        </div>

                        {/* Registro sanitario */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Registro sanitario
                            </span>
                            <span className="text-right text-theme-sm">
                                2018M-0012719-R1
                            </span>
                        </div>

                        {/* Fecha de vencimiento */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Fecha de vencimiento
                            </span>
                            <span className="text-right text-theme-sm">
                                2018-02-06
                            </span>
                        </div>

                        {/* Estado */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Estado
                            </span>
                            <p className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-red-200 text:bg-red-600 text-right `}>Por vencer</p>
                        </div>

                        {/* Stock inicial */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Stock inicial
                            </span>
                            <span className="text-right text-theme-sm">
                                20
                            </span>
                        </div>

                        {/* Stock final */}
                        <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                            <span className="text-theme-sm">
                                Stock final
                            </span>
                            <span className="text-right text-theme-sm">
                                40
                            </span>
                        </div>
                    </div>
                    
                </>)}
            </Card>
        // </div>
    );
};

export default InformacionLote;