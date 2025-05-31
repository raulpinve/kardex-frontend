import Card from '@/shared/components/Card';
import React from 'react';

const InventariosMovimientos = () => {
    return (
        <Card className={`h-full flex flex-col`}>
            <div className="flex justify-between items-center">
                <CardTitulo>Movimientos</CardTitulo>
                    <div className="flex gap-1 items-center justify-between">
                        
                        {/* Buscar en movimientos */}
                        <div className="relative hidden">
                            <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                            <input 
                                type="text" 
                                placeholder="Buscar..." 
                                className="input-form pl-10 dark:bg-gray-900"
                                value={consulta}
                                onChange={(e) => {
                                    setConsulta(e.currentTarget.value);
                                }}
                            />
                        </div>
                        {/* Tipo de movimiento */}
                        <div className="relative hidden md:block">
                            <select 
                                value={tipo}
                                onChange={(e) => setTipo(e.currentTarget.value)}
                                className='select-form'
                            >
                                <option value="">Seleccionar...</option>
                                <option value="entrada">Entrada</option>
                                <option value="salida">Salida</option>
                            </select>
                        </div>
                        <div className="relative hidden sm:block">
                            <LuCalendar className="absolute top-[14px] left-4 text-gray-600 dark:text-gray-500"/>
                            <Flatpickr
                                options={{
                                    mode: "single",
                                    dateFormat: "Y-m-d", 
                                    altInput: true,
                                    altFormat: "j \\d\\e F \\d\\e Y", // j = día sin 0, F = mes nombre completo, \\d\\e para texto literal "de"
                                    locale: Spanish,
                                    minDate: periodo ? `${periodo}-01`: "",
                                    maxDate: periodo ? `${periodo}-31`: "",
                                }}
                                onClose={(fechaSeleccionada) => {
                                    const fechaInicio = fechaSeleccionada?.[0];
                                    if (fechaInicio) {
                                        setFecha(format(fechaInicio, "yyyy-MM-dd"));
                                    }
                                }}
                                placeholder="Seleccione una fecha"
                                className="input-form shadow pl-10"
                                value={fecha}
                            />
                        </div>
                    </div>
                </div>
            
        </Card>
    );
};

export default InventariosMovimientos;