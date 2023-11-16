import React, { useState, useEffect } from 'react';
import { Treemap, Text, Tooltip } from 'recharts';
import axios from 'axios';
import StockPrediccion from './PrediccionesAccion';
import DiaNoBursatil from '../../../Error/Error';

const StockTreemap = () => {
  const [data, setData] = useState(null);
  const [dataStock, setDataStock] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo');
        const data = response.data;
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const dataStock = formatData(data.most_actively_traded);
      const dataTop = formatData(data.top_gainers);
      const dataLoser = formatData(data.top_losers);
      const mergedData = [...dataStock, ...dataTop, ...dataLoser];

      setDataStock(mergedData);
    }
  }, [data]);

  const formatData = (stocks) => {
    return stocks.map((stock) => ({
      name: stock.ticker,
      value: parseFloat(stock.price),
      volume: parseInt(stock.volume, 10),
      change: parseFloat(stock.change_amount),
      fill: stock.change_amount < 0 ? 'red' : 'green',  // Añade la propiedad 'fill'
    }));
  };

  if (!dataStock) {
    // Data is still being fetched
    return <div>Loading...</div>;
  } else if (dataStock == {} || dataStock.msg == "Dia no bursatil"){
    return <DiaNoBursatil/>

  }
  const getColor = (change) => {
    if (change <= -3 && change < 0) return 'rgb(246, 53, 56)';
    if (change <= -2 && change > -3) return 'rgb(191, 64, 69)';
    if (change <= -1 && change > -2) return 'rgb(139, 68, 78)';
    if (change <= 0 && change > -1) return 'rgb(73, 79, 94)';
    if (change > 0 && change <= 1) return 'rgb(53, 118, 78)';
    if (change > 1 && change <= 2) return 'rgb(47, 158, 79)';
    if (change > 2 && change > 0) return 'rgb(48, 204, 90)';
    return 'rgb(239, 246, 255)'
  };

  const CustomizedContent = ({ x, y, width, height, name, change }) => {
    return (
      <g onClick={() => handleRectMouseClick(name)}>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: getColor(change),
            stroke: '#fff',
            strokeWidth: 1,
          }}
        />
        {width >= 20 && height >= 25 && (
          <>
            <Text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" width={width}>
              {name}
            </Text>
            <Text x={x + width / 2} y={y + height / 2 + 14} textAnchor="middle" fill="#fff" width={width}>
              {change + '%'}
            </Text>
          </>
        )}
      </g>
    );
  };
  const handleRectMouseClick = (name) => {
    setSelectedStock(name);
    setIsModalOpen(!isModalOpen);
  };


  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, change } = payload[0].payload;
      return (
        <div style={{ background: 'rgba(255,255,255,0.8)', padding: '5px', border: '1px solid #ccc' }}>
          <p>{name}</p>
          <p>Change: {change}%</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <Treemap
        width={970}
        height={460}
        data={dataStock}
        dataKey="value"
        style={{ fontSize: '13px', fontWeight: 'bold' }}
        content={<CustomizedContent />}
      >
        <Tooltip content={renderTooltip} />
      </Treemap>
      {isModalOpen && (
        <StockPrediccion
          stock={selectedStock} // Pasa el nombre de la acción al componente modal
          onClose={setIsModalOpen}
        // Otras props según las necesidades de tu componente modal
        />
      )}

    </div>
  );
};


export default StockTreemap;
