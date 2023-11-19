import { useEffect, useState } from "react";

export default function InfoStock({ data, infoInversion }) {
  const [infoGlobal, setGlobal] = useState({});
  const [infoInver, setInfoInversion] = useState({});

  useEffect(() => {
    if (data && data['Global Quote']) {
      setGlobal(data['Global Quote']);
    }
  }, [data, infoInversion]);
  useEffect(() => {
    const inversionActual = infoInversion.stocks * infoInversion.datoReal;
    // Fórmula para el Rendimiento Porcentual
    const rendimientoPorcentual = ((infoInversion.datoPrediccion - infoInversion.datoReal) / infoInversion.datoReal) * 100;

    // Fórmula para la Inversión de 3 Días con Predicción
    const inversion3Dias = inversionActual * (1 + rendimientoPorcentual / 100);

    // Calcular ganancias o pérdidas
    const gananciaPerdida = inversion3Dias - inversionActual;

    // Dar un consejo basado en las ganancias o pérdidas
    if (gananciaPerdida > 0) {
      setInfoInversion({ inversionActual: inversionActual, inversion3Dias: inversion3Dias, gananciaPerdida: gananciaPerdida, msg: "¡Buena noticia! Posiblemente en 3 dias tengas ganancias de tu inversión." })

    } else if (gananciaPerdida < 0) {
      setInfoInversion({ inversionActual: inversionActual, inversion3Dias: inversion3Dias, gananciaPerdida: gananciaPerdida, msg: "Lo sentimos, posiblemente tengas perdidas en tu inversión." })

    } else {
      setInfoInversion({ inversionActual: inversionActual, inversion3Dias: inversion3Dias, gananciaPerdida: gananciaPerdida, msg: "Tu inversión posiblemente se mantenga sin cambios." })

    }
  }, [infoInversion]);



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
      {infoInversion &&
        <div>
          <h3 style={{ marginBottom: '2%' }}>Inversion</h3>
          <h5>Inversion actual: {infoInver.inversionActual}</h5>
          <h5>Inversion en días predecidos: {infoInver.inversion3Dias}</h5>
          <h5>Ganancias/Perdidas: {infoInver.gananciaPerdida}</h5>
          <h5>Mensaje: {infoInver.msg}</h5>
        </div>
      }
    </aside>
  );
}
