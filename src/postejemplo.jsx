import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export default function LineChart({onClose}) {
    const [labels, setAño] = useState([]);
    const [values, setValues] = useState([]);
    const [valuesP, setValuesP] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const years = generateYearOptions(2023, 2026);
    const meses = {
        Enero: 1,
        Febrero: 2,
        Marzo: 3,
        Abril: 4,
        Mayo: 5,
        Junio: 6,
        Julio: 7,
        Agosto: 8,
        Septiembre: 9,
        Octubre: 10,
        Noviembre: 11,
        Diciembre: 12
    };
    useEffect(() => {
        if (selectedMonth !== '') {
            const Mes = meses[selectedMonth];
            fetchData(Mes);
        }
    }, [selectedMonth]);



    function generateYearOptions(startYear, endYear) {
        const years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(year.toString());
        }
        return years;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://tamworth-swift-parrot-msbt.2.us-1.fl0.io/api/v1/inflacion/grafica');
                const data = response.data.data;

                // Extract labels and values from filtered data
                const labels = data.map(dato => dato.Ano + " " + dato.Mes);
                const values = data.map(dato => dato.Porcentaje);

                setAño(labels);
                setValues(values);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const fetchData = async (Mes) => {
        console.log(Mes)
        try {
            const response = await axios.post('https://tamworth-swift-parrot-msbt.2.us-1.fl0.io/api/v1/inflacion/prediccion', {
                date: {
                    year: selectedYear,
                    month: Mes,
                    day: '30',
                }
            });
            const data = response.data;
            const dataLabels = data.map(dato => dato.Ano + " " + dato.Mes);
            const labelsNuevos = dataLabels.filter(elemento => !labels.includes(elemento));

            // Combina los elementos únicos con el arreglo existente
            setAño(labels.concat(labelsNuevos));
            setValuesP(data.map(dato => dato.Porcentaje))
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'PIB Real',
                data: values,
                backgroundColor: 'rgba(75, 19, 192, 0.2)', // Color para PIB Real
                borderColor: 'rgba(75, 19, 192, 1)', // Borde para PIB Real
                borderWidth: 2,
            },
            {
                label: 'PIB Predicción',
                data: valuesP,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Color para PIB Predicción
                borderColor: 'rgba(255, 99, 132, 1)', // Borde para PIB Predicción
                borderWidth: 2,
            }
        ]
    };
    const totalDuration = 500;
    const delayBetweenPoints = totalDuration / values.length;

    const previousY = (ctx) => {
        const meta = ctx.chart.getDatasetMeta(ctx.datasetIndex);
        const prevIndex = meta.data.findIndex((item, index) => {
            return item._index === ctx.index - 1;
        });
        if (prevIndex !== -1) {
            return meta.data[prevIndex].y;
        }
        return ctx.chart.scales.y.getPixelForValue(100);
    };


    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        animation: {
            x: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: 0,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.xStarted) {
                        return 0;
                    }
                    ctx.xStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            },
            y: {
                type: 'number',
                easing: 'linear',
                duration: delayBetweenPoints,
                from: previousY,
                delay(ctx) {
                    if (ctx.type !== 'data' || ctx.yStarted) {
                        return 0;
                    }
                    ctx.yStarted = true;
                    return ctx.index * delayBetweenPoints;
                }
            }
        }
    };

    return <div className='modal_background' >
        <div className='modal_containter' style={{ backgroundColor: 'aliceblue' }}>
        <button className="close_button" onClick={() => onClose(false)}>
                            X
                        </button>
            <div className='modal_graph' style={{ width: '79vw' }}>
                <h2 style={{display:'block'}}>Predicción de Inflación</h2>
            </div>
            <div className='inputs_macro'>
            <div style={{marginRight:'15px'}}>
                <label>Año: </label>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value=""></option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Mes: </label>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}>
                    <option value=""></option>
                    {Object.keys(meses).map(mes => (
                        <option key={mes} value={mes}>{mes}</option>
                    ))}
                </select>
            </div>
            </div>
            <Line options={options} data={data} height={110} width={300} />
            
        </div>

    </div>

}