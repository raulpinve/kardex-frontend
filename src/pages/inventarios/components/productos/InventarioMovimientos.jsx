import { LuEraser, LuPencil, LuRefreshCcw } from 'react-icons/lu';
import CardTitulo from '../../../../shared/components/CardTitulo';
import Pagination from '../../../../shared/components/Pagination';
import Button from '../../../../shared/components/Button';
import Card from '../../../../shared/components/Card';
import React, { useState } from 'react';

const InventarioMovimientos = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [movimientos, setMovimientos] = useState([
        {
            id: 1,
            tipo: "entrada",
            fecha: "12-08-2024",
            descripcion: "Ingreso de 50 unidades por compra al proveedor FarmaSalud",
            cantidad: 50,
            producto: "Paracetamol 500mg",
            usuario: "Juan Pérez",
            referencia: "FAC-2024-0089",
            lote: "L-PA-001"
        },
        {
            id: 2,
            tipo: "salida",
            fecha: "14-08-2024",
            descripcion: "Salida de 20 unidades por entrega a paciente",
            cantidad: 20,
            producto: "Paracetamol 500mg",
            usuario: "Laura Gómez",
            referencia: "ORD-2024-0342",
            lote: "L-PA-001"
        },
        {
            id: 3,
            tipo: "entrada",
            fecha: "16-08-2024",
            descripcion: "Ingreso de 100 unidades por donación institucional",
            cantidad: 100,
            producto: "Ibuprofeno 400mg",
            usuario: "Carlos Méndez",
            referencia: "DON-2024-0011",
            lote: "L-IB-045"
        },
        {
            id: 4,
            tipo: "salida",
            fecha: "17-08-2024",
            descripcion: "Salida de 30 unidades por vencimiento de lote",
            cantidad: 30,
            producto: "Ibuprofeno 400mg",
            usuario: "Ana Torres",
            referencia: "AJU-2024-0154",
            lote: "L-IB-045"
        },
        {
            id: 5,
            tipo: "entrada",
            fecha: "18-08-2024",
            descripcion: "Ingreso de 200 unidades por compra regular",
            cantidad: 200,
            producto: "Amoxicilina 500mg",
            usuario: "Pedro Sánchez",
            referencia: "FAC-2024-0093",
            lote: "L-AM-210"
        },
        {
            id: 6,
            tipo: "salida",
            fecha: "19-08-2024",
            descripcion: "Salida de 60 unidades por atención ambulatoria",
            cantidad: 60,
            producto: "Amoxicilina 500mg",
            usuario: "Marta Díaz",
            referencia: "ORD-2024-0357",
            lote: "L-AM-210"
        },
        {
            id: 7,
            tipo: "entrada",
            fecha: "20-08-2024",
            descripcion: "Ingreso de 150 unidades por devolución de paciente",
            cantidad: 150,
            producto: "Omeprazol 20mg",
            usuario: "Luis Rodríguez",
            referencia: "DEV-2024-0044",
            lote: "L-OM-103"
        }
    ]);

    return (
        <Card>
            {/* Header */}
            <div className="flex justify-between items-center">
                <CardTitulo>Movimientos</CardTitulo>
                <div className="flex gap-1 items-center justify-between">
                    {/* <div className="relative hidden md:block">
                        <LuSearch className="absolute left-3.5 top-3 text-gray-600 text-lg dark:text-gray-800" />
                        <input 
                            type="text" 
                            placeholder="Buscar lote..." 
                            className="input-form pl-10 dark:bg-gray-900"
                            // value={consulta}
                            onChange={(e) => {
                                // setConsulta(e.currentTarget.value);
                            }}
                        />
                    </div> */}
                     <Button
                        type="button"
                        colorButton="primary"
                        // onClick={() => {
                        //     setModalActivo("crear")
                        // }}
                    >   
                        Crear
                    </Button>
                    <Button
                        type="button"
                        colorButton="secondary"
                        onClick={() => {
                            // setPaginaActual(1)
                            // setRefresh((prev) => prev + 1)
                        }}
                    >
                        <LuRefreshCcw />
                    </Button>
                </div>
            </div>
            <div className="min-w-0">
                <div className="overflow-x-auto w-full">
                    <table className="mt-3 min-w-full">
                        <thead>
                            <tr className="border-gray-100 border-y text-sm dark:border-gray-800 text-left">
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Tipo</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Cantidad</p>
                                </th>
                                <th className="py-3 px-4 min-w-[120px]">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Lote</p>
                                </th>
                                <th className="py-3 px-4 min-w-[120px]">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Fecha</p>
                                </th>
                                <th className="py-3 px-4 min-w-[120px]">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Descripción</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Acciones</p>
                                </th>
                            </tr>
                        </thead>
                        {loading && <SkeletonTable rows={7} columns={5}/>}
                        <tbody className="divide-y divide-gray-100  text-sm dark:divide-gray-800">
                            {/* Display error */}
                            {!loading && error && (<tr>
                                    <td colSpan="5" className="py-3 px-4">
                                        <p className="text-gray-700 dark:text-gray-400 text-center"> {error}</p>
                                    </td>
                                </tr>)
                            }

                            {/* No hay lotes por mostrar */}
                            {!loading && !error && movimientos.length === 0 && (<tr>
                                    <td colSpan="6" className="py-3 px-4">
                                        <p className="text-gray-700 dark:text-gray-400 text-center"> No hay lotes por mostrar</p>
                                    </td>
                                </tr>
                            )}

                            {/* Mapeado de lotes */}
                            {!loading && !error && movimientos.length > 0 && (
                                <>
                                    {movimientos.map((movimientos) => {
                                        return (
                                            <tr 
                                                key={movimientos.id} 
                                                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                                            >
                                                <td className="py-3 px-4 capitalize">
                                                    <div className="items-center flex gap-3 rounded-full">
                                                        <p className="text-gray-700 dark:text-gray-400 text-sm">{movimientos.tipo}</p>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="text-gray-700 dark:text-gray-400">{movimientos.cantidad}</p>
                                                </td>
                                                <td className="py-3 px-4 items-center">
                                                    <p className="text-gray-700 dark:text-gray-400">{movimientos.lote}</p>
                                                </td>
                                                <td className="py-3 px-4 lg:gap-2 items-center">
                                                    <p className="text-gray-700 dark:text-gray-400">{movimientos.fecha}</p>
                                                </td>
                                                <td className="py-3 px-4 items-center">
                                                    <p className="text-gray-700 dark:text-gray-400">{movimientos.descripcion}</p>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-gray-700 dark:text-gray-400 flex gap-2">
                                                        <button 
                                                            className="cursor-pointer p-1"
                                                            title="Editar movimiento"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // evita que se dispare el onClick del <tr>
                                                                // setModalActivo("editar"); 
                                                                // setMedicamentoSeleccionado(medicamento);
                                                            }}    
                                                        >
                                                            <LuPencil />
                                                        </button>
                                                        <button 
                                                            className="cursor-pointer p-1"
                                                            title="Eliminar movimiento"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // evita que se dispare el onClick del <tr>
                                                                // setModalActivo("eliminar"); 
                                                                // setMedicamentoSeleccionado(medi  camento);
                                                            }} 
                                                        >
                                                            <LuEraser />
                                                        </button> 
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onPageChange={setPaginaActual}
            />
        </Card>
    );
};

export default InventarioMovimientos;