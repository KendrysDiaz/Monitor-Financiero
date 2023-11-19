import React, { useState, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';


const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('COP');
  const [toCurrency, setToCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [topCurrencies, setTopCurrencies] = useState([]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        const data = await response.json();
        const rate = data.rates[toCurrency];
        setExchangeRate(rate);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const fetchTopCurrencies = async () => {
      try {
        const response = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        const data = await response.json();
        const currencies = Object.keys(data.rates).slice(0, 10);
        setTopCurrencies(currencies);
      } catch (error) {
        console.error('Error fetching top currencies:', error);
      }
    };

    fetchTopCurrencies();
  }, []);


  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedAmount(amount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
  };

  const currencies = [
    { code: 'USD', name: 'Dólar Estadounidense'},
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'Libra Esterlina' },
    { code: 'JPY', name: 'Yen Japonés' },
    { code: 'CNY', name: 'Yuan Chino' },
    { code: 'INR', name: 'Rupia India' },
    { code: 'AUD', name: 'Dólar Australiano' },
    { code: 'CAD', name: 'Dólar Canadiense' },
    { code: 'CHF', name: 'Franco Suizo' },
    { code: 'SEK', name: 'Corona Sueca' },
    // Agrega más divisas según sea necesario
  ];

  return (
    <div style={{placeSelf: 'center', padding: '0 2%'}}>
      <div style={{textAlign: 'center', marginBottom: "5%"}}>
      <img src="https://images.emojiterra.com/google/android-12l/512px/1f4b1.png" alt="Emoji" width={50}/>

      </div>
      <div style={{marginBottom: '5%'}}>
        <TextField
          type="number"
          value={amount}
          onChange={handleAmountChange}
          label="Monto en COP"
          variant="outlined"
          style={{backgroundColor: 'white',width: '255px'}}
        />
      </div>
      <div style={{marginBottom: '4%'}}>
        <FormControl variant="outlined">
          <InputLabel id="to-currency-label">Divisa para convertir</InputLabel>
          <Select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            style={{backgroundColor: 'white'}}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency.code} value={currency.code}>{currency.code} - {currency.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div >
        
      <TextField
          type="text"
          value={convertedAmount}
          onChange={handleAmountChange}
          label="Resultado"
          variant="outlined"
          disabled="true"
          style={{backgroundColor: 'white', width: '200px'}}
        />
      </div>
    </div>
  );
};

export default CurrencyConverter;
