import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';

export default function GraphDesempleoYears() {
    const [data, setData] = useState([]);
    const chartInstance = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://tamworth-swift-parrot-msbt.2.us-1.fl0.io/api/v1/desempleo/grafica');
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
            const chartElement = document.getElementById('chartDesempleo');
            const chartDesempleo = createChart(chartElement, {
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
                },priceScale: {
                    mode: 2,
                    autoScale: true,
                    alignLabels: true,
                    borderVisible: false,
                    borderColor: '#139bc0',
                    scaleMargins: {
                      top: 0.30,
                      bottom: 0.25,
                    },
                  },
                  crosshair: {
                    mode: 1,
                    vertLine: {
                      color: '#6A8372',
                      style: 1,
                      width: 5,
                      labelVisible: false,
                    },
                    horzLine: {
                      visible: false,
                      labelVisible: false
                    },
                  },
            });
            chartDesempleo.applyOptions({
                watermark: {
                    visible: true,
                    text: 'DESEMPLEO',
                    fontSize: 28,
                    horzAlign: 'center',
                    vertAlign: 'center',
                    color: '#aaaa'
                },
            });

            const sortedData = data.sort((a, b) => new Date(`${a.Ano}-${a.MesNumerico>9?a.MesNumerico:`0${a.MesNumerico}`}-01`) - new Date(`${b.Ano}-${b.Trimestre * 3 > 9 ? b.Trimestre * 3 : "0" + b.Trimestre * 3}-01`));

            const chartData = sortedData.map((item) => ({
                time: `${item.Ano}-${item.MesNumerico>9?item.MesNumerico:`0${item.MesNumerico}`}-01`,
                value: item.Tasa,
            }));

            const lineSeries = chartDesempleo.addLineSeries({color: '#132bc0'});
            lineSeries.setData(chartData);
            chartInstance.current = chartDesempleo;

            // Establece el rango de tiempo del gráfico
            const firstDate = chartData[0].time;
            const lastDate = chartData[chartData.length - 1].time;
            chartDesempleo.timeScale().setVisibleRange({
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
            }, 70);// Ajusta este valor para cambiar la velocidad de la animación

            return () => {
                clearInterval(intervalId);
                if (chartInstance.current !== null) {
                    chartInstance.current.remove();
                }
            };
        }



    }, [data]);

    return <div id="chartDesempleo" className='graphM' style={{marginBottom:'16px'}}/>;
};
