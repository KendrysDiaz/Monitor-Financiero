import Sidebar from "./Sidebar/Sidebar";
import './Dashboard.css'
import Navbar from "../Navbar/Navbar";
import Home from "../Home/Home"
import Macro from "../Indicator/Macro/Macro";
import Micro from "../Indicator/Micro/Micro";
import Investment from "../Investment/Investment";
import Actions from "../Actions/Actions";
import { useState } from "react";

export default function Dashboard() {
    const [optionState, setOptionState] = useState('Inicio');
    const updateState = (newComponent) => {
        // definimos la función de actualización de estado del Sidebar
        setOptionState(newComponent);
      };
    const componentMap = {
        'Inicio': <Home/>,
        'Macro': <Macro/>,
        'Micro': <Micro/>,
        'Inversiones & Acciones': <Investment/>
    };

    const Component = componentMap[optionState]

    return <div className="dashboard">
        <Sidebar updateState={updateState}/>  
        <div className="dashboard_content">
            <Navbar option={optionState == 'Macro'? 'Indicadores Macroeconómicos' : optionState == 'Micro' ? 'Moneda' : optionState}/>
            {Component}
        </div>
    </div>
}