import React, { useState } from 'react';

const ProjectExplanation = () => {
  const explanations = [
    "GlobalTrackTrends: Visualiza y analiza rankings de Spotify",
    "Top-50 y Top-50 Viral de 72 países",
    "Análisis interactivo de tendencias musicales globales",
    "Descubre patrones y preferencias musicales por región"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextExplanation = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % explanations.length);
  };

  const prevExplanation = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + explanations.length) % explanations.length);
  };

  const drawCloud = (x, y, width, height, text, onClick = null) => (
    <g key={`cloud-${x}-${y}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <path
        d={`M${x},${y + height/2} 
           c-9.4,0-17,7.6-17,17c0,9.4,7.6,17,17,17h${width}c9.4,0,17-7.6,17-17c0-9.4-7.6-17-17-17 
           c-1.1,0-2.2,0.1-3.2,0.3c-0.4-3.5-3.4-6.3-7-6.3c-2.5,0-4.7,1.3-6,3.3c-1.8-5.6-7-9.6-13.1-9.6 
           c-6.1,0-11.3,4-13.1,9.6c-1.3-2-3.5-3.3-6-3.3C28.4,11,25.4,13.8,25,17.3C23.9,17.1,22.8,17,21.7,17z`}
        fill="white"
        stroke="#007bff"
        strokeWidth="2"
      />
      <text x={x + width/2} y={y + height/2 + 5} textAnchor="middle" fill="#007bff" fontSize="14">
        {text}
      </text>
    </g>
  );

  const drawArrow = (x, y, direction, onClick) => (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <circle cx={x} cy={y} r="20" fill="white" stroke="#007bff" strokeWidth="2" />
      <path
        d={direction === 'left' 
           ? `M${x-5},${y} l-10,10 l10,10` 
           : `M${x+5},${y} l10,10 l-10,10`}
        fill="none"
        stroke="#007bff"
        strokeWidth="2"
      />
    </g>
  );

  return (
    <div style={{ width: '100%', height: '200px', margin: '20px 0' }}>
      <svg width="100%" height="100%" viewBox="0 0 600 200">
        {drawCloud(100, 0, 400, 100, explanations[currentIndex])}
        {drawArrow(50, 100, 'left', prevExplanation)}
        {drawArrow(550, 100, 'right', nextExplanation)}
      </svg>
    </div>
  );
};

export default ProjectExplanation;