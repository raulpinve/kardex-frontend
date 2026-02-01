import { LuCalendar, LuChartColumn, LuChartSpline, LuCloudDownload, LuRefreshCcw } from "react-icons/lu";
import React, { useEffect, useMemo, useState } from "react";
import { handleErrorsBasic } from "@/utils/handleErrors";
import { Spanish } from "flatpickr/dist/l10n/es";
import ReactApexChart  from "react-apexcharts";
import { useParams } from "react-router-dom";
import "flatpickr/dist/themes/airbnb.css";
import ApexCharts from "apexcharts"; 
import { useDarkMode } from "@/shared/hooks/useDarkMode";
import Card from "@/shared/components/Card";
import CardTitulo from "@/shared/components/CardTitulo";
import { dateColombiaFormat, formatCantidad} from "@/utils/utilities";
import Loader from "@/shared/components/Loader";
import { obtenerEvolucionLoteCorte } from "../../services/cortesServices";

const GraficaStockLotesCorte = () => {
    const [mostrarBotones, setMostrarBotones] = useState(false);
    const [tipoGrafica, setTipoGrafica] = useState("area");
    const [messageError, setMessageError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [series, setSeries] = useState();
    const [datos, setDatos] = useState([]);
    const { darkMode } = useDarkMode();
    const {corteId, loteId} = useParams();

    const options = {
        chart: {
            redrawOnParentResize: true,
            id: "stockChart",
            background: 'transparent',
            type: tipoGrafica,
                toolbar: {
                    show: false,
                },
            stacked: false, 
        },
        theme: {
            mode: darkMode ? 'dark' : 'light',
        },
        fill: {
            type: "solid",
            opacity: 0.3
        },
        yaxis: {
            labels: {
                style: {
                    fontFamily: "Outfit, sans-serif", 
                },
            },
            tickAmount: 4,
        },
        stroke: {
            curve: "smooth", 
            width: 1, 
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            show: false, 
            borderColor: "#f3f4f6", 
            position: "back",
        },
        xaxis: {
            type: 'category',
            labels: {
                style: {
                    fontFamily: "Outfit", 
                },
            },
        },
        title: {
            align: "center",
        },
        colors: ['#16a34a', '#2563eb', '#f97316', '#6b21a8'], // verde, azul, naranja, violeta oscuro,
        legend: {
            fontFamily: 'Outfit, sans-serif', 
        }
    };

    const handleDownload = () => {
        ApexCharts.exec("stockChart", "dataURI").then(({ imgURI }) => {
            const link = document.createElement("a");
            link.href = imgURI;
            link.download = "grafico.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const toggleChartType = () => {
        setTipoGrafica((prevType) => (prevType === "bar" ? "area" : "bar"));
    };

   
    // Obtener evolución histórica del lote
    useEffect(() => {
        const fecthEvolucion = async () => {
            setLoading(true);
            setMessageError(null);

            try {
                const respuesta = await obtenerEvolucionLoteCorte(corteId , loteId);
                const datosRespuestas = respuesta?.data?.evolucion || [];

                setDatos(datosRespuestas);
                setSeries([
                    {
                        name: "Stock inicial",
                        data: datosRespuestas.map(dato => ({
                            x: dateColombiaFormat(dato.fecha),
                            y: dato.stockInicial
                        })),
                    },
                    {
                        name: "Ingresos",
                        data: datosRespuestas.map(dato => ({
                            x: dateColombiaFormat(dato.fecha),
                            y: dato.ingresos,
                        })),
                    },
                    {
                        name: "Salidas",
                        data: datosRespuestas.map(dato => ({
                            x: dateColombiaFormat(dato.fecha),
                            y: dato.salidas
                        })),
                    },
                    {
                        name: "Stock Final",
                        data: datosRespuestas.map(dato => ({
                            x: dateColombiaFormat(dato.fecha),
                            y: dato.stockFinal
                        })),
                    }
                ]);
                
                if(datosRespuestas.length > 0) {
                    setMostrarBotones(true);
                }
            } catch (error) {
                handleErrorsBasic(error, setMessageError)
            } finally {
                setLoading(false);
            }
        }
        if(loteId) fecthEvolucion();
    }, [loteId, corteId])

    return (
        <Card className={`relative`}>
            {/* header */}
            <div className="md:flex justify-between items-center">
                <div>
                    <CardTitulo>Comportamiento del stock en el corte</CardTitulo>
                </div>
                <div className="flex items-center mt-3 gap-1">
                    {mostrarBotones && (<>                        
                        <button
                            onClick={handleDownload}
                            className="button-form button-form-secondary"
                        >
                            <LuCloudDownload />
                        </button>

                        <button 
                            onClick={toggleChartType} 
                            className="button-form button-form-secondary"
                        >{tipoGrafica === "bar" ? <LuChartSpline /> : <LuChartColumn />}</button>
                    </>)}
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
                    {/* Contenedor gráfica */}
                    <div className="xl:order-2 xl:mt-0 border rounded-lg border-gray-200 xl:dark:border-gray-800 mt-4 p-2">
                        <ReactApexChart 
                            options={options}
                            type={tipoGrafica}
                            series={series} 
                            height={340} 
                            id="stockChart"
                        />
                    </div>

                    {/* Contenedor tabla */}
                    <div className="xl:order-1 mt-6 xl:mt-0 xl:border-r border rounded-lg border-gray-200 dark:border-gray-800">
                        <div className="overflow-x-auto w-full h-[300px]">
                            <table className="w-full min-w-max text-sm text-center ">
                                <thead className='border-b border-gray-200 dark:border-gray-800 text-xs sticky top-0'>
                                    <tr>
                                        <th className="p-3 text-left bg-gray-100 dark:bg-gray-800 rounded-tl-lg">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Fecha</p>
                                        </th>
                                        <th className="p-3 bg-gray-100 dark:bg-gray-800">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Stock inicial</p>
                                        </th>
                                        <th className="p-3 bg-gray-100 dark:bg-gray-800">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Ingresos</p>
                                        </th>
                                        <th className="p-3 bg-gray-100 dark:bg-gray-800">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Salidas</p>
                                        </th>
                                        <th className="p-3 bg-gray-100 dark:bg-gray-800 rounded-tr-lg">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Stock Final</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {datos.map(dato => (
                                        <tr key={dato.fecha} className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            <td className="p-3 text-left">
                                                <p className="text-gray-700 dark:text-gray-400">
                                                {dateColombiaFormat(dato.fecha)}
                                                </p>
                                            </td>
                                            <td className="p-3">
                                                <p className="text-gray-700 dark:text-gray-400">{formatCantidad(dato.stockInicial)}</p>
                                            </td>
                                            <td className="p-3">
                                                <p className="text-gray-700 dark:text-gray-400">{formatCantidad(dato.ingresos)}</p>
                                            </td>
                                            <td className="p-3">
                                                <p className="text-gray-700 dark:text-gray-400">{formatCantidad(dato.salidas)}</p>
                                            </td>
                                            <td className="p-3">
                                                <p className="text-gray-700 dark:text-gray-400">{formatCantidad(dato.stockFinal)}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}

export default GraficaStockLotesCorte;