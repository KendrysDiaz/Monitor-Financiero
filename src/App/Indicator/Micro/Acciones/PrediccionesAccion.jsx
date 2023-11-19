import { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import {
    TextField,
    Button,
    OutlinedInput,
    InputAdornment
} from '@mui/material';


export default function StockPrediccion({ stock, infoInversion}) {
    const chartContainerRef = useRef(null);
    const chart = useRef(null);
    const candleSeries = useRef(null);
    const [dataHistory, setHistory] = useState(null);
    const [stocks, setStocks] = useState('20');
    const [dataPrediction, setPrediction] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=IBM&apikey=demo`);
                const data = response.data;
                const history = data['Monthly Time Series'];
                setHistory(history);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [stock]);
    useEffect(() => {
        const fetchPredict = async () => {
            try {
                    const response = await axios.get(`https://api-python-weathered-dream-3802.fly.dev/indicadores/acciones/prediccion/${stock}`);
                    const data = response.data;
                    setPrediction(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchPredict();
    }, [dataHistory, stock])

    useEffect(() => {
        if (dataHistory && dataPrediction) {
            chart.current = createChart(chartContainerRef.current, {
                width: 620,
                height: 320,
                layout: {
                    background: {
                        type: 'solid',
                        color: '#000000',
                    },
                    textColor: 'rgba(255, 255, 255, 0.9)',
                },
                grid: {
                    vertLines: {
                        color: 'rgba(197, 203, 206, 0.5)',
                    },
                    horzLines: {
                        color: 'rgba(197, 203, 206, 0.5)',
                    },
                },
                rightPriceScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                },
                timeScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                },
            });
            const dataHistoryDates = Object.keys(dataHistory);

            const predictionData = dataPrediction
                .filter((item) => !dataHistoryDates.includes(item.fecha))
                .map((item) => ({
                    time: item.fecha,
                    value: parseFloat(item.valor),
                }));

            console.log(predictionData);
        if (predictionData.length > 0) {
            // Add a new series for predicted data
            const predictionSeries = chart.current.addLineSeries({
                color: 'blue', // You can set any color you prefer
                lineWidth: 2,
            });

            // Set predicted data to the new series
            predictionSeries.setData(predictionData);
        }
            candleSeries.current = chart.current.addCandlestickSeries({
                upColor: 'rgb(48, 204, 90)',
                downColor: 'rgb(246, 53, 56)',
                borderDownColor: 'rgb(246, 53, 56)',
                borderUpColor: 'rgb(48, 204, 90)',
                wickDownColor: 'rgb(246, 53, 56)',
                wickUpColor: 'rgb(48, 204, 90)',
            });
            const sortedData = Object.entries(dataHistory).map(([date, item]) => ({
                time: date,
                open: parseFloat(item['1. open']),  // Convert string to number if needed
                high: parseFloat(item['2. high']),
                low: parseFloat(item['3. low']),
                close: parseFloat(item['4. close'])
            })).sort((a, b) => {
                if (a.time > b.time) {
                    return 1;
                }
                if (a.time < b.time) {
                    return -1;
                }
                return 0;
            });
            candleSeries.current.setData(sortedData);
            return () => {
                if (chart.current !== null) {
                    chart.current.remove();
                }
            };
        }
    }, [dataHistory, stock, dataPrediction]);
    const handleStocksChange = (event) => {
        const nuevoValor = parseFloat(event.target.value);
        if (!isNaN(nuevoValor) && nuevoValor >= 20) {
            setStocks(nuevoValor);
        }
    };
    const sendInfo = () => {
        if (stock && dataHistory && dataPrediction) {
        const info = {inversiones: stocks, datoReal: Object.values(dataHistory)[0]['4. close'], datoPrediccion: dataPrediction[length-1].valor}
        infoInversion(info);}
    };

    return <div>
        <div ref={chartContainerRef} />
        <h5 style={{ margin: '3% 0' }}>Inversión</h5>
        <div style={{ marginTop: '4%' }}>
            <OutlinedInput
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Amount"
                value={dataHistory != null ? Object.values(dataHistory)[0]['4. close'] : "Cargando..."}
                style={{ marginRight: '2%' }}
                disabled={true}
            />
            <TextField
                label="Cantidad de Acciones"
                variant="outlined"
                type="number"
                value={stocks >= 20 ? stocks : ""}
                onChange={handleStocksChange}
                style={{ marginRight: '4%' }}
                InputProps={{ inputProps: { min: 20 } }}
            />
            <Button variant="contained" color='primary' onClick={() => sendInfo()}>
                Invertir
            </Button>
        </div>

    </div>
}