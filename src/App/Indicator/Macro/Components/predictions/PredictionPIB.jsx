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

export default function PredictionPIB({onClose}) {
    const [labels, setAño] = useState([]);
    const [values, setValues] = useState([]);
    const [valuesP, setValuesP] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const years = generateYearOptions(2023, 2026);
    
    function generateYearOptions(startYear, endYear) {
        const years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(year.toString());
        }
        return years;
    }

    function predictions(value) {
        console.log(value)
        setSelectedMonth(value)
        console.log(selectedMonth)
        fetchData()
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://tamworth-swift-parrot-msbt.2.us-1.fl0.io/api/v1/pib/grafica');
                const data = response.data.data;

                // Extract labels and values from filtered data
                const labels = data.map(dato => dato.Ano + "-" + dato.Trimestre);
                const values = data.map(dato => dato.PIB);
                console.log(labels)
                setAño(labels);
                setValues(values);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.post('https://tamworth-swift-parrot-msbt.2.us-1.fl0.io/api/v1/pib/prediccion', {
                date: selectedYear+"-"+selectedMonth
            });
            const data = response.data;
            const dataLabels = data.map(dato => dato.Ano + "-" + dato.Trimestre);
            const labelsNuevos = dataLabels.filter(elemento => !labels.includes(elemento));

            // Combina los elementos únicos con el arreglo existente
            setAño(labels.concat(labelsNuevos));
            setValuesP(data.map(dato => dato.PIB))
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
                <h2 style={{display:'block'}}>Predicción de PIB</h2>
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
                <label>Trimestre: </label>
                <select
                    value={selectedMonth}
                    onChange={(e) => predictions(e.target.value)}>
                    <option value=""></option>
                    <option value="Q1">1</option>
                    <option value="Q2">2</option>
                    <option value="Q3">3</option>
                    <option value="Q4">4</option>
                </select>
            </div>
            </div>
            <Line options={options} data={data} height={110} width={300} />
            
        </div>

    </div>

}