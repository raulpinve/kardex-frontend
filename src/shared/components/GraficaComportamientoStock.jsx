import { obtenerInformacionHistorial } from '../services/historialStockServices';
import { formatDateCorte } from '../../utils/utilities';
import React, { useEffect, useRef, useState } from 'react';
import { LuChartColumn, LuChartSpline, LuCloudDownload } from 'react-icons/lu';
import ReactApexChart  from 'react-apexcharts';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CardTitulo from './CardTitulo';
import ApexCharts from 'apexcharts'; 
import Loader from './Loader';
import Card from './Card';

function StockRangeSelector({ selected, setSelected }) {
    const baseClasses = "rounded-md px-3 py-2 text-theme-sm font-medium hover:text-gray-900 dark:hover:text-white cursor-pointer";
    const activeClasses = "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800";
    const inactiveClasses = "text-gray-500 dark:text-gray-400";
  
    return (
      <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900 text-sm ">
        <button
          onClick={() => setSelected(3)}
          className={`${baseClasses} ${selected === 3 ? activeClasses : inactiveClasses}`}
        >
            3 meses
        </button>
        <button
          onClick={() => setSelected(6)}
          className={`${baseClasses} ${selected === 6 ? activeClasses : inactiveClasses}`}
        >
            6 meses
        </button>
        <button
          onClick={() => setSelected(12)}
          className={`${baseClasses} ${selected === 12 ? activeClasses : inactiveClasses}`}
        >
            12 meses
        </button>
      </div>
    );
}


const GraficaComportamientoStock = ({tipo = "producto"}) => {
    const [mostrarBotones, setMostrarBotones] = useState(false);
    const [tipoGrafica, setTipoGrafica] = useState("area");
    const token = useSelector(state => state.auth.token);
    const [mesSelected, setMesSelected] = useState(6);
    const [loading, setLoading] = useState(true);
    const {loteId, productoId} = useParams();
    const [series, setSeries] = useState();
    const id = loteId ? loteId: productoId;

    const options = {
        chart: {
             redrawOnParentResize: true,
            id: 'stockChart',
            type: tipoGrafica,
                toolbar: {
                    show: false,
                },
        },
        fill: tipoGrafica === "bar"
        ? {
            type: "solid",
          }
        : {
            type: "gradient",
            gradient: {
              shade: "light",
              type: "vertical",
              shadeIntensity: 0.5,
              gradientToColors: ["#1E90FF"],
              inverseColors: true,
              opacityFrom: 0.4,
              opacityTo: 0,
            },
          },
        yaxis: {
            labels: {
                style: {
                    fontFamily: 'Arial, sans-serif', 
                },
            },
            tickAmount: 5,
        },
        stroke: {
            curve: 'smooth', 
            width: 2, 
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            show: true, 
            borderColor: '#f3f4f6', 
            position: 'back',
        },
        xaxis: {
        categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        labels: {
                style: {
                    fontFamily: 'Outfit', 
                },
            },
        },
        title: {
            align: 'center',
        },
        colors: ['#2563eb', '#3b82f6', '#60a5fa']
    };

    const handleDownload = () => {
        ApexCharts.exec('stockChart', 'dataURI').then(({ imgURI }) => {
            const link = document.createElement('a');
            link.href = imgURI;
            link.download = 'grafico.png';
            link.click();
          });
    };

    // Obtener información para la gráfica
    useEffect(() => {
        const fetchHistorial = async() => {
            setLoading(true);
            try {
                const respuesta = await obtenerInformacionHistorial(token, tipo, id, mesSelected);
                setSeries([
                    {
                        name: 'Ingresos',
                        data: respuesta.data.map(corte => ({
                            x: formatDateCorte(corte.fechaCorte),
                            y: corte.ingresos,
                        })),
                    },
                    {
                      name: 'Salidas',
                      data: respuesta.data.map(corte => ({
                        x: formatDateCorte(corte.fechaCorte),
                        y: corte.salidas
                      })),
                    },
                    {
                      name: 'Stock Final',
                      data: respuesta.data.map(corte => ({
                        x: formatDateCorte(corte.fechaCorte),
                        y: corte.stockFinal
                      })),
                    }
                ]);
                setMostrarBotones(true);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if(tipo, id){
            fetchHistorial()
        }
    }, [tipo, id, token, mesSelected])

    const toggleChartType = () => {
        setTipoGrafica((prevType) => (prevType === "bar" ? "area" : "bar"));
    };

    return (
        <Card className={`relative`}>
            <div className='flex items-start justify-between'>
                <div>
                    <CardTitulo>Comportamiento del stock</CardTitulo>
                    <span className="block text-gray-500 dark:text-gray-400  text-sm">
                        Evolución en los últimos {mesSelected} meses
                    </span>
                </div>
                <div className='flex items-center'>
                    {mostrarBotones && (
                        <>                        
                            <button
                                onClick={handleDownload}
                                className="p-2.5 mr-2 text-sm rounded-lg button-form-secondary text-gray-800 cursor-pointer"
                            >
                                <LuCloudDownload />
                            </button>
                            <button 
                                onClick={toggleChartType} 
                                className="p-2.5 mr-2 text-sm rounded-lg button-form-secondary text-gray-800 cursor-pointer"
                            >{tipoGrafica === "bar" ? <LuChartSpline /> : <LuChartColumn />}</button>
                        </>
                    )}
                    <StockRangeSelector {...{selected: mesSelected, setSelected: setMesSelected}} />
    
                </div>
            </div>
            <div className={`h-[340px] w-full ${loading ? "flex items-center  justify-center": ""} `}>
                {loading && ( <Loader />)}
                {!loading && (
                    <ReactApexChart 
                        options={options}
                        type={tipoGrafica}
                        series={series} 
                        height={340} 
                        id="stockChart"
                    />
                )}
            </div>
        </Card>
    );
};

export default GraficaComportamientoStock;