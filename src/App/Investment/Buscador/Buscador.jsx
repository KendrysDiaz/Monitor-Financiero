import { useState } from "react"
import InfoStock from "../Informacion/Informacion";
import axios from "axios";

export default function BuscadorStock() {
    const [stock, setStock] = useState("");
    const [infoStock, setInfo] = useState(null);
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
    
      return (<div style={{marginBottom: '1%'}}>
      <form onSubmit={handleSubmit}>
          <label htmlFor="acciones">Acciones:</label>
          <input
            type="text"
            id="acciones"
            name="acciones"
            placeholder="Ingrese el symbol..."
            value={stock}
            onChange={handleInputChange}
          />
          <button type="submit">Buscar</button>
        </form>
        {infoStock != null && 
        <InfoStock data={infoStock}/>}
      </div>
        
      );
}