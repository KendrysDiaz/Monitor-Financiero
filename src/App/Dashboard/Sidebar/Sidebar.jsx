import { useState } from "react";
import "./Sidebar.css";

import { AiFillHome } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa6";
import { BiWorld } from "react-icons/bi";
import { BsCoin } from "react-icons/bs";
import { PiChartLineUpBold } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";

export default function Sidebar({updateState}) {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [selected, setSelected] = useState('Inicio');

  const toggleSubMenu = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };
  
  const toggleStateDash = (Option) => {
    updateState(Option);
    setSelected(Option);
  };

  const styleIcon = {width:'11%', marginRight:'12px', height:'11%'}
  const styleSelected = {backgroundColor:'rgb(239, 246, 255)', borderRadius:'10px 0 0 10px', color:'rgb(30, 35, 80)'}
  return (
    <div className="sidebar">
      <section className="sidebar_header">
        <img src='src\Assets\logo.png' width={60} alt=""/>
        <h3>Monitor Financiero</h3>
      </section>
      <div className="sidebar_main">
        <ul>
          <li>
            <div className="menu-item" style={selected === 'Inicio' ? styleSelected : {}} onClick={() => {toggleSubMenu(0), toggleStateDash('Inicio')}}>
              <AiFillHome style={styleIcon}/> 
              <span>Inicio</span>
              </div>
          </li>
          <li>
            <div className="menu-item" onClick={() => toggleSubMenu(1)}>
              <BiWorld style={styleIcon}/><span>Indicadores</span><IoIosArrowDown style={{paddingLeft:'20%',paddingBottom: '1%',width:'7%'}}/>
            </div>
            <div className={openSubMenu === 1?'sub-menu open':'sub-menu'}>
              <ul className={' open'}>
                <li style={selected === 'Macro' ? styleSelected : {}} onClick={() => toggleStateDash('Macro')}> <FaChevronRight style={{paddingRight:'6%', width:'6%', marginTop: '2px'}} /><span>Macro</span></li>
                <li style={selected === 'Micro' ? styleSelected : {}}onClick={() => toggleStateDash('Micro')}> <FaChevronRight style={{paddingRight:'6%', width:'6%', marginTop: '2px'}}/><span>Micro</span></li>
              </ul>
            </div>
          </li>
          <li>
          <div className="menu-item" style={selected === 'Acciones' ? styleSelected : {}} onClick={() => {toggleSubMenu(0), toggleStateDash('Acciones')}}>
            <PiChartLineUpBold style={styleIcon} width={100}/><span>Acciones</span>
            </div>            
          </li>
          <li>
          <div className="menu-item" style={selected === 'Inversiones' ? styleSelected : {}} onClick={() => {toggleSubMenu(0), toggleStateDash('Inversiones')}}>
              <BsCoin style={styleIcon}/>
              <span>Inversiones</span></div>
          </li>
        </ul>
      </div>
    </div>
  );
};
