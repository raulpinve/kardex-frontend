import React from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';

const InformacionLote = () => {
    return (
        <Card className={`text-sm text-gray-700 dark:text-gray-400 col-span-12 xl:col-span-4 `}>
            <CardTitulo className="flex justify-between">
                <span>Lote</span>
                <span>HGH-SD-SDD</span>
            </CardTitulo>
            
            <div className='my-5'>
                {/* Producto */}
                <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                    <span className="text-theme-sm">
                        Producto
                    </span>
                    <span className="text-right text-theme-sm capitalize">
                        Atropina
                    </span>
                </div>

                {/* Registro sanitario */}
                <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                    <span className="text-theme-sm">
                        Registro sanitario
                    </span>
                    <span className="text-right text-theme-sm capitalize">
                        FRGF-FDGF-25
                    </span>
                </div>

                {/* Fecha de vencimiento */}
                <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                    <span className="text-theme-sm">
                        Fecha de vencimiento
                    </span>
                    <span className="text-right text-theme-sm capitalize">
                        2024-03-02
                    </span>
                </div>

                {/* Stock disponible */}
                <div className="flex items-center justify-between border-b border-gray-100 py-3 dark:border-gray-800">
                <span className="text-theme-sm">
                    StockDisponible
                </span>
                <span className="text-right text-theme-sm capitalize">
                    45
                </span>
            </div>
        </div>
    </Card>);
};

export default InformacionLote;