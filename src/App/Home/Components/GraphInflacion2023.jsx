import '../Css/Graph.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, PointElement, BarElement, Tooltip, Legend} from 'chart.js';

Chart.register(LinearScale, CategoryScale, PointElement, BarElement, Tooltip, Legend);

export default function GraphInflacion2023() {
    const [labels, setAño] = useState([]);
    const [values, setValues] = useState([]);
  
    // Define los 7 colores por defecto de Chart.js
    const colors = ['rgba(255, 99, 200, 0.2)','rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'];
  
    const options = {
      scales: {
        y: {
          beginAtZero: true,
            display: true,
            title: {
              display: true,
              text: 'Porcentaje %'
            },
        }
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            boxWidth: 20,
            padding: 20,
            font: {
              size: '16px',
              weight: 'bold', 
            },
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              if (label) {
                return label + ': ' + context.parsed.y + '%';
              }
              return context.parsed.y;
            }
          }
        }
      }
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('https://tamworth-swift-parrot-msbt.2.us-1.fl0.io/api/v1/inflacion/grafica');
          const data = response.data.data;
          const filteredData = data.filter(dato => dato.Ano == 2023);
  
          // Extract labels and values from filtered data
          const labels = filteredData.map(dato => dato.Mes + " " + dato.Ano);
          const values = filteredData.map(dato => dato.Porcentaje);
  
          setAño(labels);
          setValues(values);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []); 
  
    // Asigna un color a cada barra del gráfico
    const backgroundColors = values.map((value, index) => colors[index % colors.length]);
    
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Inflación',
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.2', '1')),
          borderWidth: 2,
          hoverBackgroundColor: backgroundColors.map(color => color.replace('0.2', '0.4')),
          hoverBorderColor: backgroundColors.map(color => color.replace('0.2', '1')),
          data: values
        }
      ]
    };
    
    return (
      <div className="graph" style={{ height: '56vh', width: '47vw', padding:'26px 7px 0 7px' }}>
        <Bar data={data} options={options} />
      </div>
    );

}