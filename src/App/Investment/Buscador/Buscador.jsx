import { useState } from "react"
import InfoStock from "../Informacion/Informacion";
import axios from "axios";
import StockPrediccion from "../../Indicator/Micro/Acciones/PrediccionesAccion";
import StockTreemap from "../../Indicator/Micro/Acciones/Acciones";

export default function BuscadorStock() {
  const [stock, setStock] = useState("");
  const [infoStock, setInfo] = useState(null);
  const [stockData, setStockData] = useState([]);

  // Función para actualizar la información de stock
  const actualizarStock = (nuevaData) => {
    setStockData(nuevaData);
  };
  const handleInputChange = (event) => {
    setStock(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (stock !== "") {
      try {
        const response = await axios.get(
          `https://api-python-weathered-dream-3802.fly.dev/indicadores/acciones/info/${stock}`
        );
        const data = response.data;
        setInfo(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    }
  };

  return (<div style={{ marginBottom: '1%' }}>
    <form onSubmit={handleSubmit} style={{ marginBottom: '8px' }}>
      <label htmlFor="acciones" style={{ marginRight: '1%', fontWeight: 'bold' }}>Acciones</label>
      <input
        type="text"
        id="acciones"
        name="acciones"
        placeholder="Ingrese el symbol..."
        value={stock}
        onChange={handleInputChange}
        style={{ marginRight: '1%' }}
      />
      <button type="submit" style={{ fontWeight: 'bold', backgroundColor: 'cornflowerblue', borderRadius: '4px', padding: '0 5px' }}>Buscar</button>
    </form>
    {infoStock != null ? <div style={{ display: 'flex', marginTop: '1%' }}>

      <InfoStock data={infoStock} infoInversion={stockData} />
      <StockPrediccion stock={stock} infoInversion={actualizarStock} />
    </div> : <StockTreemap />}
  </div>

  );
}