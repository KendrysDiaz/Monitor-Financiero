import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { io } from 'socket.io-client';
import axios from 'axios';

const URL = 'https://tamworth-swift-parrot-msbt.2.us-1.fl0.io';
const socket = io(URL);

export default function MonedaSockets() {
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);
  const [dataGraph, setGraph] = useState([]);
  const [statusMoneda, setStatus] = useState(null);
  useEffect(() => {
    socket.on('live', (data) => {
      const nuevoPrecio = { 'valor': data.quotes.USDCOP, 'vigenciadesde': data.quotes.timestamp }
      setGraph((prevData) => [...prevData, nuevoPrecio]);
    });
    return () => socket.off('live');
  }, [socket])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://tamworth-swift-parrot-msbt.2.us-1.fl0.io/api/v1/moneda/datos');
        const data = response.data;
        setGraph(data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (!dataGraph) return;
    chartInstance.current = createChart(chartContainerRef.current, {
      width: 800,
      height: 400,
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#333',
      }, leftPriceScale: {
        visible: true,
        borderVisible: true,
      },
      rightPriceScale: {
        visible: false,
      },
    });
    chartInstance.current.applyOptions({
      watermark: {
        visible: true,
        text: 'Precio del COP respecto al dolár',
        fontSize: 28,
        horzAlign: 'center',
        vertAlign: 'center',
        color: '#aaaa'
      },
    });
    const series = chartInstance.current.addAreaSeries({
      topColor: statusMoneda ? 'rgb(0, 160, 54, 0.56)' : statusMoneda == false ? 'rgb(243, 17, 67, 0.56)' : 'rgb(48, 74, 255, 0.56)',
      bottomColor: statusMoneda ? 'rgb(0, 160, 54, 0.04)' : statusMoneda == false ? 'rgb(243, 17, 67,0.04)' : 'rgb(48, 74, 255, 0.04)',
      lineColor: statusMoneda ? 'rgb(0, 160, 54, 1)' : statusMoneda == false ? 'rgb(243, 17, 67)' : 'rgb(48, 74, 255)',
      lineWidth: 2,
    });

    const sortedData = dataGraph.map(item => ({
      time: item.vigenciadesde,
      value: parseFloat(item.valor),
    })).sort((a, b) => {
      if (a.time > b.time) {
        return 1;
      }
      if (a.time < b.time) {
        return -1;
      }
      return 0;
    });

    series.setData(sortedData);

    // Suponiendo que sortedData es un array de objetos con una propiedad 'value'
    const lastIndex = sortedData.length - 1;

    sortedData.forEach((item, index) => {
      // Compara solo si no es el último elemento
      if (index == lastIndex) {
        const nextItem = sortedData[index - 1];

        if (item.value > nextItem.value) {
          setStatus(true);
          series.createPriceLine({
            price: item.value,
            color: 'green', // Cambiado a verde para indicar subida
            lineStyle: 2,
            title: 'Subió 🔝',
            priceAxisLabelVisible: false,
          });
        } else if (item.value < nextItem.value) {
          setStatus(false);
          series.createPriceLine({
            price: item.value,
            color: 'red',
            lineStyle: 2,
            title: 'Bajó ⬇️',
            priceAxisLabelVisible: false,
          });
        }
        // Puedes agregar un caso más para manejar la igualdad si es necesario
      }
    });


    return () => {
      if (chartInstance.current !== null) {
        chartInstance.current.remove();
        chartInstance.current = null;
      }
    };
  }, [dataGraph, socket]);

  return (<div ref={chartContainerRef} />);
}
