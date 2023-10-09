import React from 'react';
import '../Css/Card.css'; 

const Card = (props) => {
  return (
    <div className="card" style={{background: props.background}}>
      <div className="card-content">
        <h2 className="card-title">{props.title}</h2>
        <p className="card-description">{props.description}</p>
      </div>
    </div>
  );
}

export default Card;
