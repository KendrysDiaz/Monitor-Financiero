import { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2'; // Cambia 'Bar' por 'Doughnut'
import { Chart, CategoryScale, PointElement, ArcElement, Tooltip, Legend} from 'chart.js';

Chart.register(CategoryScale, PointElement, ArcElement, Tooltip, Legend); // Cambia 'LinearScale' y 'BarElement' por 'ArcElement'

export default function GraphDesempleo2023() {

    const [labels, setAño] = useState([]);
    const [values, setValues] = useState([]);
  
    // Define los 7 colores por defecto de Chart.js
    const colors = ['rgba(255, 99, 200, 0.8)','rgba(255, 99, 132, 0.8)', 'rgba(255, 159, 64, 0.8)', 'rgba(255, 205, 86, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(201, 210, 200, 0.8)'];
  
    const options = {
      plugins: {
        legend: {
          display: true,
          labels: {
            boxWidth: 20,
            padding: 20
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const label = context.dataset.label || '';
              if (label) {
                return label + ': ' + context.parsed.y;
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
          const response = await axios.get('https://api-node-v1-o9xv-dev.fl0.io/api/v1/inflacion/');
          const data = response.data.data;
          const filteredData = data.filter(dato => dato.Ano == 2023);
  
          // Extract labels and values from filtered data
          const labels = filteredData.map(dato => dato.Mes + " " + dato.Ano);
          const Values = filteredData.map(dato => dato.Porcentaje);
  
          setAño(labels);
          setValues(Values);
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
          label: 'Inflación 2023',
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.2', '1')),
          borderWidth: 2,
          hoverBackgroundColor: backgroundColors.map(color => color.replace('0.2', '0.6')),
          hoverBorderColor: backgroundColors.map(color => color.replace('0.2', '1')),
          data: values
        }
      ]
    };
    
    return (
      <div className="graph" style={{ height: '59.4vh', width: '25vw', padding:'5px 7px 0 7px' }}>
        <Doughnut data={data} options={options} />
      </div>
    );
    
}