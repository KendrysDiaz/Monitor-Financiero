import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import PredictionInfla from './predictions/PredictionInfla';

export default function GraphInflaYears() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const chartInstance = useRef(null);
    const handleChartClick = () => {
        setIsModalOpen(!isModalOpen); // Abre el modal cuando se hace clic en el gráfico
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://tamworth-swift-parrot-msbt.2.us-1.fl0.io/api/v1/inflacion/grafica');
                const data = response.data.data;
                setData(data);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };
        fetchData();

    }, []); // Se ejecutará cuando data cambie y no sea un array vacío

    useEffect(() => {
        if (data.length > 0) {
            const chartElement = document.getElementById('chartInfla');
            const chartInfla = createChart(chartElement, {
                width: 453, // Ajusta el ancho del gráfico según tus necesidades
                height: 230,
                layout: {
                    background: {
                        color: '#eff6ff'
                    },
                }, leftPriceScale: {
                    scaleMargins: {
                        top: 0.2,
                        bottom: 0.2,
                    },
                    visible: true,
                    borderVisible: true,
                },
                rightPriceScale: {
                    visible: false,
                },
                grid: {
                    horzLines: {
                        color: '#e6e6e6',
                    },
                    vertLines: {
                        color: '#e6e6e6',
                    },
                }, priceScale: {
                    mode: 2,
                    autoScale: true,
                    alignLabels: true,
                    borderVisible: false,
                    borderColor: '#139bc0',
                    scaleMargins: {
                        top: 0.30,
                        bottom: 0.25,
                    },
                }, crosshair: {
                    mode: 1,
                    horzLine: {
                        visible: true,
                        labelVisible: true
                    },
                    vertLine: {
                        color: 'rgb(128, 128, 128)',
                          style: 1,
                          width: 5,
                          labelVisible: false,
                    }
                },
            });
            chartInfla.applyOptions({
                watermark: {
                    visible: true,
                    text: 'INFLACIÓN',
                    fontSize: 28,
                    horzAlign: 'center',
                    vertAlign: 'center',
                    color: '#aaaa'
                },
            });


            const sortedData = data.sort((a, b) => new Date(`${a.Ano}-${a.MesNumerico>9?a.MesNumerico:`0${a.MesNumerico}`}-01`) - new Date(`${b.Ano}-${b.Mes}-01`));

            const chartData = sortedData.map((item) => ({
                time: `${item.Ano}-${item.MesNumerico>9?item.MesNumerico:`0${item.MesNumerico}`}-01`,
                value: item.Porcentaje,
            }));

            const lineSeries = chartInfla.addLineSeries({ color: '#132bc0' });
            lineSeries.setData(chartData);
            chartInstance.current = chartInfla;

            // Establece el rango de tiempo del gráfico
            const firstDate = chartData[0].time;
            const lastDate = chartData[chartData.length - 1].time;
            chartInfla.timeScale().setVisibleRange({
                from: firstDate,
                to: lastDate,
            });
            let index = 0;
            const intervalId = setInterval(() => {
                if (index < chartData.length) {
                    lineSeries.setData(chartData.slice(0, index + 1));
                    index++;
                } else {
                    clearInterval(intervalId);
                }
            }, 60);// Ajusta este valor para cambiar la velocidad de la animación

            return () => {
                clearInterval(intervalId);
                if (chartInstance.current !== null) {
                    chartInstance.current.remove();
                }
            };
        }

    }, [data]);

    return <>
        <div id="chartInfla" className='graphM' onClick={handleChartClick}/>
        {isModalOpen && <PredictionInfla onClose={handleChartClick}/>}
    </>;
};
