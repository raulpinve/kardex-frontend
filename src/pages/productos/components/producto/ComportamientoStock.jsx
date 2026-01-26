import Card from '@/shared/components/Card';
import CardTitulo from '@/shared/components/CardTitulo';
import GraficaStock from '@/shared/components/GraficaStock';
import Table from '@/shared/components/Table';
import TableTbody from '@/shared/components/TableTbody';
import TableTd from '@/shared/components/TableTd';
import TableTh from '@/shared/components/TableTh';
import TableThead from '@/shared/components/TableThead';
import TableTr from '@/shared/components/TableTr';
import React, { useState } from 'react';

const ComportamientoStock = () => {
    const [loading, setLoading] = useState(false);
    const [messageError, setMessageError] = useState(null);
    const [tipoGrafica, setTipoGrafica] = useState("bar");
    const [options, setOptions] = useState();
    const [series, setSeries] = useState();
    const [datos, setDatos] = useState([]);
    
    return (
        <Card >
            {/* Header */}
            <div className='md:flex justify-between items-center'>
                <div className="">
                    <CardTitulo>Comportamiento del stock</CardTitulo>
                    <p className="text-sm text-gray-400 dark:text-gray-200">Evolución desde enero de 2025 a febrero de 2025</p>
                </div>
            </div>

            {loading && (<div className={`h-[400px] w-full mt-5 flex items-center  justify-center`}>
                <Loader /> 
            </div>)}

            {!loading && messageError  && (<div className="flex justify-center items-center">
                <p className="text-sm text-gray-400 dark:text-gray-200">{messageError}</p>
            </div>
            )}

            {!loading && !messageError && datos.length === 0 && (
                <div className={`h-[400px] w-full mt-5 flex items-center  justify-center`}>
                    <p className="text-sm text-gray-400 dark:text-gray-200">
                        No hay suficientes datos para mostrar la gráfica.
                    </p>
                </div>
            )}

            {!loading && !messageError && datos.length > 0 && (
                <div className="xl:grid xl:grid-cols-[1fr_1.5fr] xl:gap-4 mt-3">
                    <div className="xl:order-2 xl:mt-0 border rounded-lg border-gray-200 xl:dark:border-gray-800 mt-4 p-2">
                        <GraficaStock 
                            tipoGrafica={tipoGrafica}
                            options={options}
                            series={series}
                        />
                    </div>
                    <div className="xl:order-1 mt-6 xl:mt-0 xl:border-r border rounded-lg border-gray-200 dark:border-gray-800">
                        <Table>
                            <TableThead>
                                <TableTr>
                                    <TableTh>Fecha</TableTh>
                                    <TableTh>Stock inicial</TableTh>
                                    <TableTh>Ingresos</TableTh>
                                    <TableTh>Salidas</TableTh>
                                    <TableTh>Stock final</TableTh>
                                </TableTr>
                            </TableThead>
                            <TableTbody>
                                {datos.map(dato => (
                                    <TableTr>
                                        <TableTd>{dato.periodo}</TableTd>
                                        <TableTd>{dato.stockInicial}</TableTd>
                                        <TableTd>{dato.ingresos}</TableTd>
                                        <TableTd>{dato.salidas}</TableTd>
                                        <TableTd>{dato.stockFinal}</TableTd>
                                    </TableTr>
                                ))}
                            </TableTbody>
                        </Table>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default ComportamientoStock;