import React from 'react';
import '../Css/Card.css'; 

const Card = (props) => {
  return (
    <div className="card" style={{ background: props.background, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="card-content">
        <h2 className="card-title" style={props.title=='Inflación / Septiembre'?{fontSize: "large"}:{fontSize:'larger'}}>{props.title}</h2>
        <p className="card-description">{props.description}</p>
      </div>
    </div>
  );
}

export default Card;
