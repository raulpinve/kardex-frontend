import React, { useState } from 'react';
import Card from '../../../../shared/components/Card';
import CardTitulo from '../../../../shared/components/CardTitulo';
import Button from '../../../../shared/components/Button';
import { LuRefreshCcw, LuSearch } from 'react-icons/lu';
import { dateColombiaFormat, obtenerEstadoVencimiento } from '../../../../utils/utilities';
import Pagination from '../../../../shared/components/Pagination';
import { useNavigate } from 'react-router-dom';

const InventarioLotes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const navigate = useNavigate();

    const [lotes, setLotes] = useState([
        {
            id: 1,
            numeroLote: "23045299", 
            registroSanitario: "2018M-0012719-R1",
            fechaVencimiento: "2024-01-12",
            stockInicial: 25,
            stockDisponible: 30
        },
        {
            id: 2,
            numeroLote: "23045300", 
            registroSanitario: "2019M-0048910-R2",
            fechaVencimiento: "2025-06-30",
            stockInicial: 50,
            stockDisponible: 45
        },
        {
            id: 3,
            numeroLote: "23045301", 
            registroSanitario: "2020M-0076123-R3",
            fechaVencimiento: "2026-03-15",
            stockInicial: 100,
            stockDisponible: 98
        },
        {
            id: 4,
            numeroLote: "23045302", 
            registroSanitario: "2021M-0023411-R4",
            fechaVencimiento: "2025-11-20",
            stockInicial: 60,
            stockDisponible: 60
        },
        {
            id: 5,
            numeroLote: "23045303", 
            registroSanitario: "2022M-0098765-R5",
            fechaVencimiento: "2027-08-05",
            stockInicial: 30,
            stockDisponible: 25
        },
        {
            id: 6,
            numeroLote: "23045304", 
            registroSanitario: "2023M-0054321-R6",
            fechaVencimiento: "2026-12-10",
            stockInicial: 80,
            stockDisponible: 79
        },
        {
            id: 7,
            numeroLote: "23045305", 
            registroSanitario: "2024M-0011223-R7",
            fechaVencimiento: "2028-04-01",
            stockInicial: 40,
            stockDisponible: 35
        }
    ]);

    const redireccionar = (corteId, loteId) => {
        navigate(`/inventarios/lote/${corteId}/${loteId}`)
    }

    return (
        <Card>
            {/* Header */}
            <div className="flex justify-between items-center">
                <CardTitulo>Lotes</CardTitulo>
                <div className="flex gap-1 items-center justify-between">
                    <div className="relative hidden md:block">
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
                    </div>
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
                <div className="overflow-x-auto w-full ">
                    <table className="mt-3 min-w-full">
                        <thead>
                            <tr className="border-gray-100 border-y text-sm dark:border-gray-800 text-left">
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Número de lote</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Registro sanitario</p>
                                </th>
                                <th className="py-3 px-4 min-w-[120px]">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Fecha de vencimiento</p>
                                </th>
                                <th className="py-3 px-4 min-w-[120px]">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Estado</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Stock inicial</p>
                                </th>
                                <th className="py-3 px-4">
                                    <p className="font-medium text-gray-700 dark:text-gray-400">Stock disponible</p>
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
                            {!loading && !error && lotes.length === 0 && (<tr>
                                    <td colSpan="5" className="py-3 px-4">
                                        <p className="text-gray-700 dark:text-gray-400 text-center"> No hay lotes por mostrar</p>
                                    </td>
                                </tr>
                            )}

                            {/* Mapeado de lotes */}
                            {!loading && !error && lotes.length > 0 && (
                                <>
                                    {lotes.map((lote) => {
                                    const { estado, color } = obtenerEstadoVencimiento(lote.fechaVencimiento);

                                    return (
                                        <tr 
                                            key={lote.id} 
                                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                                            onClick={() => {
                                                redireccionar(lote.id, lote.id)
                                            }}
                                        >
                                            <td className="py-3 px-4 ">
                                                <div className="items-center flex gap-3 rounded-full">
                                                    <p className="text-gray-700 dark:text-gray-400 text-sm">{lote.numeroLote}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400">{lote.registroSanitario}</p>
                                            </td>
                                            <td className="py-3 px-4 lg:gap-2 items-center">
                                                <p className="text-gray-700 dark:text-gray-400">{dateColombiaFormat(lote.fechaVencimiento)}</p>
                                            </td>
                                            <td className="py-3 px-4 items-center">
                                                <p className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
                                                    {estado}
                                                </p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400">{lote.stockInicial}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-gray-700 dark:text-gray-400">{lote.stockDisponible}</p>
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

export default InventarioLotes;