// src/components/Marquee.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Slider_moneda = () => {
  const [prices, setPrices] = useState([]);
  const [previousPrices, setPreviousPrices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://open.er-api.com/v6/latest/COP'
        );

        const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CNY', 'INR', 'BRL', 'RUB'];
        const data = await Promise.all(
          currencies.map(async (currency) => {
            const exchangeRate = response.data.rates[currency];
            const currencyData = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
            const value = {
              cop: currencyData.data.rates.COP,
              [currency.toLowerCase()]: 1 / exchangeRate
            };

            return {
              currency,
              value,
            };
          })
        );

        // Almacenar los precios anteriores antes de actualizar
        setPreviousPrices(prices);

        // Añadir una copia de la primera moneda al final para evitar espacio en blanco
        setPrices([...data, data[0]]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Actualiza cada 1 minuto

    return () => clearInterval(interval);
  }, [prices]); // Agregar 'prices' como dependencia para que se ejecute cuando 'prices' cambie
  const currencySymbols = {
    'USD': { symbol: '$', color: 'green' },
    'EUR': { symbol: '€', color: 'blue' },
    'GBP': { symbol: '£', color: 'red' },
    'JPY': { symbol: '¥', color: 'purple' },
    'AUD': { symbol: 'A$', color: 'orange' },
    'CAD': { symbol: 'C$', color: 'brown' },
    'CNY': { symbol: '¥', color: 'pink' },
    'INR': { symbol: '₹', color: 'maroon' },
    'BRL': { symbol: 'R$', color: 'teal' },
    'RUB': { symbol: '₽', color: 'olive' },
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', marginBottom: '1%'}}>
      <marquee>
        {prices.map((currency, index) => (
          <div style={{ display: 'inline-block', marginRight: '15px' }}>
            <span key={index} style={{ color: currencySymbols[currency.currency].color, fontWeight: 'bolder' }}>
              {currencySymbols[currency.currency].symbol}
            </span>
            <span style={{ fontWeight: 'bolder' }}>

              {currency.currency}:
            </span>
            {currency.value.cop.toFixed(2)}COP
          </div>
        ))}
      </marquee>
    </div>
  );
};

export default Slider_moneda;
