import React from 'react';
import { NavigationBarStyles } from '../styles/NavigationBarStyles';

export default function NavigationBar() {
  return (
    <nav style={NavigationBarStyles.container}>
      <button style={NavigationBarStyles.button}>Playlists de todos los países</button>
      <button style={NavigationBarStyles.button}>Analíticas (En construcción)</button>
    </nav>
  );
}