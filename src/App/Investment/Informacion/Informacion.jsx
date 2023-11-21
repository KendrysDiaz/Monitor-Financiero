import { useEffect, useState } from "react";

export default function InfoStock({ data, infoInversion }) {
  const [infoGlobal, setGlobal] = useState({});
  const [infoInversionState, setInfoInversion] = useState(null);

  useEffect(() => {
    if (data && data['Global Quote']) {
      setGlobal(data['Global Quote']);
    }
  }, [data]);

  useEffect(() => {
    if (infoInversion) {
      const inversionActual = infoInversion.inversiones * parseInt(infoInversion.datoReal);

      // Verificar si datoReal es un número válido
      if (!isNaN(inversionActual)) {
        const rendimientoPorcentual = ((infoInversion.datoPrediccion - infoInversion.datoReal) / infoInversion.datoReal) * 100;
        const inversion3Dias = Math.round(inversionActual * (1 + rendimientoPorcentual / 100));
        const gananciaPerdida = inversion3Dias - inversionActual;

        let msg = "";
        if (gananciaPerdida > 0) {
          msg = "¡Buena noticia! Posiblemente en 3 días tengas ganancias de tu inversión.";
        } else if (gananciaPerdida < 0) {
          msg = "Lo sentimos, posiblemente tengas pérdidas en tu inversión.";
        } else {
          msg = "Tu inversión posiblemente se mantenga sin cambios.";
        }

        setInfoInversion({ inversionActual, inversion3Dias, gananciaPerdida, msg });
      }
    }
  }, [infoInversion]);
  console.log(infoInversion)
  return (
    <aside style={{ backgroundColor: 'lavender', height: '74vh', width: '23vw', padding: '1% 2% 0 2%', marginRight: '2%' }}>
      <h4 style={{ marginBottom: '2%' }}>
        Información 💲💰
      </h4>
      <h5>Acción: {infoGlobal['01. symbol']}</h5>
      <h5>Último día de negociación: {infoGlobal['07. latest trading day']} </h5>
      <h5>Precio actual: ${infoGlobal['05. price']}</h5>
      <h5 style={{ marginBottom: '2%' }}>Tasa de cambio con el precio anterior: {infoGlobal['10. change percent']}</h5>
      ----------------------------------
      {infoInversionState && (
        <div>
          <h3 style={{ marginBottom: '2%' }}>Inversion</h3>
          <h5>Inversion actual: ${infoInversionState.inversionActual}</h5>
          <h5>Inversion en días predecidos: ${infoInversionState.inversion3Dias}</h5>
          <h5>Ganancias/Perdidas: ${infoInversionState.gananciaPerdida}</h5>
          <h5>Mensaje: {infoInversionState.msg}</h5>
        </div>
      )}
    </aside>
  );
}
