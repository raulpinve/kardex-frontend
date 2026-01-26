import React from 'react';
import ReactApexChart from 'react-apexcharts';

const GraficaStock = ({ tipoGrafica, options, series }) => {
    return (
        <ReactApexChart 
            options={options}
            type={tipoGrafica}
            series={series} 
            height={340} 
            id="stockChart"
        /> 
    );
};

export default GraficaStock;