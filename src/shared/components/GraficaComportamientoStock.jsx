import { obtenerEvolucionProducto, obtenerEvolucionProductoCorte, obtenerInformacionHistorial } from "../services/historialStockServices";
import { LuCalendar, LuChartColumn, LuChartSpline, LuCloudDownload, LuRefreshCcw } from "react-icons/lu";
import React, { useEffect, useMemo, useState } from "react";
import { formatDateCorte, formatFechaCorte } from "../../utils/utilities";
import { handleErrorsBasic } from "@/utils/handleErrors";
import { Spanish } from "flatpickr/dist/l10n/es";
import ReactApexChart  from "react-apexcharts";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import CardTitulo from "./CardTitulo";
import ApexCharts from "apexcharts"; 
import Loader from "./Loader";
import Card from "./Card";
import { format } from  'date-fns';
import { es } from "date-fns/locale/es";
import { useDarkMode } from "../hooks/useDarkMode";

const GraficaComportamientoStock = ({tipo = "producto", corteId}) => {
    const [mostrarBotones, setMostrarBotones] = useState(false);
    const [tipoGrafica, setTipoGrafica] = useState("area");
    const [messageError, setMessageError] = useState(null);
    const token = useSelector(state => state.auth.token);
    const [rangoFechas, setRangoFechas] = useState([]);
    const [loading, setLoading] = useState(false);
    const {loteId, productoId} = useParams();
    const [series, setSeries] = useState();
    const [datos, setDatos] = useState([]);
    const id = loteId ? loteId: productoId;
    const { darkMode } = useDarkMode();

    const options = {
        chart: {
            redrawOnParentResize: true,
            id: "stockChart",
            background: darkMode ? '#transparent' : '',
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
                    fontFamily: "Work Sans, sans-serif", 
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
                    fontFamily: "Work Sans", 
                },
            },
        },
        title: {
            align: "center",
        },
        colors: ['#16a34a', '#2563eb', '#f97316', '#6b21a8'], // verde, azul, naranja, violeta oscuro,
        legend: {
            fontFamily: 'Work Sans, sans-serif', 
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

    function parseDateLocal(dateString) {
        // dateString esperado: "YYYY-MM-DD"
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day); // Mes es 0-based
    }

    function formatearRangoFechas(fechas) {
        if (fechas.length !== 2) return '';

        const fechaInicio = parseDateLocal(fechas[0]);
        const fechaFin = parseDateLocal(fechas[1]);
        const formato = "d 'de' MMMM 'de' yyyy";

        return `${format(fechaInicio, formato, { locale: es })} hasta ${format(fechaFin, formato, { locale: es })}`;
    }

    const toggleChartType = () => {
        setTipoGrafica((prevType) => (prevType === "bar" ? "area" : "bar"));
    };

    const fechasFormateadas = useMemo(() => {
        return rangoFechas.map(fecha => {
            const year = fecha.getFullYear();
            const month = String(fecha.getMonth() + 1).padStart(2, "0");
            const day = String(fecha.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        });
    }, [rangoFechas]);

    // Obtener información para la gráfica
    useEffect(() => {
        const fetchHistorialEntreFechas = async() => {
            setLoading(true);
            setMessageError(null);
            try {
                const respuesta = await obtenerInformacionHistorial(token, tipo, id, fechasFormateadas);
                const datosRespuestas = respuesta?.data?.datos || [];

                setDatos(datosRespuestas);
                setSeries([
                    {
                        name: "Stock inicial",
                        data: datosRespuestas.map(corte => ({
                            x: formatFechaCorte(corte.periodo),
                            y: corte.stockInicial
                        })),
                    },
                    {
                        name: "Ingresos",
                        data: datosRespuestas.map(corte => ({
                            x: formatFechaCorte(corte.periodo),
                            y: corte.ingresos,
                        })),
                    },
                    {
                        name: "Salidas",
                        data: datosRespuestas.map(corte => ({
                            x: formatFechaCorte(corte.periodo),
                            y: corte.salidas
                        })),
                    },
                    {
                        name: "Stock Final",
                        data: datosRespuestas.map(corte => ({
                            x: formatFechaCorte(corte.periodo),
                            y: corte.stockFinal
                        })),
                    }
                ]);
                setMostrarBotones(true);
            } catch (error) {
                handleErrorsBasic(error, setMessageError)
            } finally {
                setLoading(false);
            }
        }

        const fetchObtenerCortes = async () => {
            setLoading(true);
            setMessageError(null);
            try {
                const respuesta = await obtenerEvolucionProducto(token, tipo, id);
                const datosRespuesta = respuesta?.data || [];
                setDatos(datosRespuesta);
                setSeries([
                    {
                        name: "Stock inicial",
                        data: datosRespuesta.map(corte => ({
                            x: formatDateCorte(corte.periodo),
                            y: corte.stockInicial
                        })),
                    },
                    {
                        name: "Ingresos",
                        data: datosRespuesta.map(corte => ({
                            x: formatDateCorte(corte.periodo),
                            y: corte.ingresos,
                        })),
                    },
                    {
                        name: "Salidas",
                        data: datosRespuesta.map(corte => ({
                            x: formatDateCorte(corte.periodo),
                            y: corte.salidas
                        })),
                    },
                    {
                        name: "Stock final",
                        data: datosRespuesta.map(corte => ({
                            x: formatDateCorte(corte.periodo),
                            y: corte.stockFinal
                        })),
                    }
                ]);
                setMostrarBotones(true);
            } catch (error) {
                handleErrorsBasic(error, setMessageError)
            } finally {
                setLoading(false);
            }
        }

        const obtenerEvolucionPorCorte = async() => {
         setLoading(true);
            setMessageError(null);
            try {
                const respuesta = await obtenerEvolucionProductoCorte(token, tipo, id, corteId)
                const datosRespuestas = respuesta?.data?.datos || [];
                setDatos(datosRespuestas);
                setSeries([
                    {
                        name: "Stock inicial",
                        data: datosRespuestas.map(corte => ({
                            x: formatFechaCorte(corte.periodo),
                            y: corte.stockInicial
                        })),
                    },
                    {
                        name: "Ingresos",
                        data: datosRespuestas.map(corte => ({
                            x: formatFechaCorte(corte.periodo),
                            y: corte.ingresos,
                        })),
                    },
                    {
                        name: "Salidas",
                        data: datosRespuestas.map(corte => ({
                            x: formatFechaCorte(corte.periodo),
                            y: corte.salidas
                        })),
                    },
                    {
                        name: "Stock Final",
                        data: datosRespuestas.map(corte => ({
                            x: formatFechaCorte(corte.periodo),
                            y: corte.stockFinal
                        })),
                    }
                ]);
                setMostrarBotones(true);
            } catch (error) {
                handleErrorsBasic(error, setMessageError)
            } finally {
                setLoading(false);
            }
        }
        if(tipo && id){
            if(corteId){
                obtenerEvolucionPorCorte()
            }else if(fechasFormateadas.length){
                fetchHistorialEntreFechas()
            }else{
                fetchObtenerCortes()
            }
        }

    },[token, tipo, id, fechasFormateadas, corteId]);

    return (
        <Card className={`relative`}>
            {/* header */}
            <div className="md:flex justify-between items-center">
                <div>
                    <CardTitulo>Comportamiento del stock</CardTitulo>
                    {fechasFormateadas.length === 0 && !corteId && (
                        <p className="text-sm text-gray-400 dark:text-gray-200">Evolución desde el ultimo año</p>
                    )}
                    {fechasFormateadas.length === 0 && corteId && (
                        <p className="text-sm text-gray-400 dark:text-gray-200">Evolución en el corte</p>
                    )}
                    {fechasFormateadas.length > 0 && (
                        <p className="text-sm text-gray-400 dark:text-gray-200">Evolución desde {formatearRangoFechas(fechasFormateadas)}</p>
                    )}

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
                        
                        {!corteId && (<>
                            <button
                                type="button"
                                className="button-form button-form-secondary"
                                onClick={() => {
                                    setRangoFechas([])
                                }}
                            >
                                <LuRefreshCcw />
                            </button>
                            <div className="relative">
                                <LuCalendar className="absolute top-[14px] left-4 text-gray-600 dark:text-gray-500"/>
                                <Flatpickr
                                    options={{
                                        mode: "range",
                                        dateFormat: "Y-m-d", 
                                        altInput: true,
                                        altFormat: "j \\d\\e F \\d\\e Y", // j = día sin 0, F = mes nombre completo, \\d\\e para texto literal "de"
                                        locale: Spanish,
                                    }}
                                    placeholder="Selecciona un rango de fechas..."
                                    value={rangoFechas}
                                    onClose={(fechaSeleccionada) => setRangoFechas(fechaSeleccionada)}
                                    className="input-form shadow pl-10"
                                />
                            </div>
                        </>)}
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
                        <div className="overflow-x-auto w-full">
                            <table className="w-full min-w-max text-sm text-center">
                                <thead className='border-b border-gray-200 dark:border-gray-800 text-xs'>
                                    <tr>
                                        <th className="py-3 px-2 text-left bg-gray-100 dark:bg-gray-800 rounded-tl-lg">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Fecha</p>
                                        </th>
                                        <th className="py-3 px-2 bg-gray-100 dark:bg-gray-800">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Stock inicial</p>
                                        </th>
                                        <th className="py-3 px-2 bg-gray-100 dark:bg-gray-800">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Ingresos</p>
                                        </th>
                                        <th className="py-3 px-2 bg-gray-100 dark:bg-gray-800">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Salidas</p>
                                        </th>
                                        <th className="py-3 px-2 bg-gray-100 dark:bg-gray-800 rounded-tr-lg">
                                            <p className="font-medium text-gray-700 dark:text-gray-400">Stock Final</p>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {datos.map(dato => (
                                        <tr key={dato.periodo} className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                            <td className="py-3 px-2 text-left">
                                                <p className="text-gray-700 dark:text-gray-400">
                                                {fechasFormateadas.length > 0 || corteId ?  formatFechaCorte(dato.periodo): formatDateCorte(dato.periodo)}
                                                </p>
                                            </td>
                                            <td className="py-3 px-2">
                                                <p className="text-gray-700 dark:text-gray-400">{dato.stockInicial}</p>
                                            </td>
                                            <td className="py-3 px-2">
                                                <p className="text-gray-700 dark:text-gray-400">{dato.ingresos}</p>
                                            </td>
                                            <td className="py-3 px-2">
                                                <p className="text-gray-700 dark:text-gray-400">{dato.salidas}</p>
                                            </td>
                                            <td className="py-3 px-2">
                                                <p className="text-gray-700 dark:text-gray-400">{dato.stockFinal}</p>
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

export default GraficaComportamientoStock;