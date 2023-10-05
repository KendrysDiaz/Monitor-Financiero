import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale,  PointElement, LineElement} from 'chart.js';

Chart.register(LinearScale, CategoryScale,  PointElement, LineElement);

const data = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
  datasets: [
    {
      label: 'Ventas mensuales',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)',
      hoverBorderColor: 'rgba(75, 192, 192, 1)',
      data: [65, 59, 80, 81, 56]
    }
  ]
};

const options = {
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

const BarChart = () => (
  <div style={{ width: '60%', margin: '10px auto' }}>
    <h2>Gráfico de Línea</h2>
    <Line data={data} options={options} />
  </div>
);

export default BarChart;
