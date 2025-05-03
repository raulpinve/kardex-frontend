import CardTitulo from '../../../../shared/components/CardTitulo';
import Card from '../../../../shared/components/Card';
import ReactApexChart  from 'react-apexcharts';
import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts'; // la librería con los métodos como exec()
import { LuCloudDownload } from 'react-icons/lu';
import Loader from '../../../../shared/components/Loader';

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
        <button
          onClick={() => setSelected(24)}
          className={`${baseClasses} ${selected === 24 ? activeClasses : inactiveClasses}`}
        >
            24 meses
        </button>
      </div>
    );
  }

const options = {
    chart: {
    id: 'stockChart',
    type: 'area',
        toolbar: {
            show: false,
        },
    },
    
    yaxis: {
        labels: {
            style: {
                fontFamily: 'Arial, sans-serif', 
            },
        },
        tickAmount: 4,
    },
    stroke: {
        curve: 'smooth', // Hace la curva más suave
        width: 2, // Controla el grosor de la línea
    },
    dataLabels: {
        enabled: false, // Desactiva los datalabels
    },
    grid: {
        show: true, // Muestra el grid
        borderColor: '#f3f4f6', // bg-gray-200
        position: 'back', // Asegura que el grid esté detrás de las líneas
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
};

const series = [
    {
      name: 'Stock final',
      data: [30, 40, 35, 50, 49, 60],
      color: '#2563eb', // bg-blue-600 (más oscuro)
    },
    {
      name: 'Ingresos',
      data: [40, 55, 45, 60, 55, 70],
      color: '#3b82f6', // bg-blue-500 (intermedio)
    },
    {
      name: 'Salidas',
      data: [20, 30, 25, 40, 38, 50],
      color: '#60a5fa', // bg-blue-400 (más claro)
    },
];

const GraficaProducto = () => {
    const [selected, setSelected] = useState(6);
    const [loading, setLoading] = useState(true);
    const [mostrarBotonDescarga, setMostrarBotonDescarga] = useState(false);

    const handleDownload = () => {
        ApexCharts.exec('stockChart', 'dataURI').then(({ imgURI, blob }) => {
            const link = document.createElement('a');
            link.href = imgURI;
            link.download = 'grafico.png';
            link.click();
          });
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000)
    }, [])

    return (
        <Card className={`relative`}>
            <div className='flex items-start justify-between'>
                <div>
                    <CardTitulo>Comportamiento del stock</CardTitulo>
                    <span className="block text-gray-500 dark:text-gray-400  text-sm">
                        Evolución en los últimos {selected} meses
                    </span>
                </div>
                <div className='flex items-center'>
                    <StockRangeSelector {...{selected, setSelected}} />
                    {mostrarBotonDescarga && (
                        <button
                            onClick={handleDownload}
                            className="p-2 ml-2 text-sm rounded-full bg-blue-600 text-white cursor-pointer"
                        >
                            <LuCloudDownload />
                        </button>
                    )}
                </div>
            </div>
            <div className={`h-[340px] w-full ${loading ? "flex items-center  justify-center": ""} `}>
                {loading 
                    ? <Loader/>
                    : <ReactApexChart options={options} series={series} type="area" height={340} id="stockChart"/>
                }
            </div>
        </Card>
    );
};

export default GraficaProducto;