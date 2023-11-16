import { useState, useEffect, useRef } from "react"
import axios from 'axios';
import { createChart } from 'lightweight-charts';


export default function StockPrediccion({ stock, onClose }) {
    const chartContainerRef = useRef(null);
    const chart = useRef(null);
    const candleSeries = useRef(null);
    const [dataHistory, setHistory] = useState(null);
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
    }, []);

    useEffect(() => {
        if (dataHistory) {
            chart.current = createChart(chartContainerRef.current, {
                width: 600,
                height: 300,
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
    }, [dataHistory]);

    return <div className='modal_background' >
        <div className='modal_containter' style={{ backgroundColor: 'aliceblue' }}>
            <button className="close_button" onClick={() => onClose(false)}>
                X
            </button>
            <h2 style={{ display: 'block' }}>ACCIONES DE {stock}</h2>
            <div className='modal_graph' style={{ width: '79vw', height: '500px' }}>
                <div ref={chartContainerRef} />
            </div>
        </div>
    </div>
}