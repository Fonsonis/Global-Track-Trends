import React from 'react';
import { NavigationBarStyles } from '../styles/NavigationBarStyles';

export default function NavigationBar({ currentView, onViewChange }) {
  return (
    <nav style={NavigationBarStyles.container}>
      <button 
        style={{
          ...NavigationBarStyles.button,
          backgroundColor: currentView === 'playlists' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
        }}
        onClick={() => onViewChange('playlists')}
      >
        Playlists de todos los países
      </button>
      <button 
        style={{
          ...NavigationBarStyles.button,
          backgroundColor: currentView === 'userPlaylists' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
        }}
        onClick={() => onViewChange('userPlaylists')}
      >
        Mis Playlists
      </button>
      <button 
        style={{
          ...NavigationBarStyles.button,
          backgroundColor: currentView === 'analytics' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
        }}
        onClick={() => onViewChange('analytics')}
      >
        Analíticas (En construcción)
      </button>
    </nav>
  );
}