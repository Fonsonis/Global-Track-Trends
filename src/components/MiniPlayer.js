import React from 'react';
import { Play, Pause, X } from 'lucide-react';
import { MiniPlayerStyles } from '../styles/MiniPlayerStyles';

export default function MiniPlayer({ song, isPlaying, togglePlayPause, onClick, onClose }) {
  return (
    <div style={MiniPlayerStyles.container} onClick={onClick}>
      <img src={song.album.images[0].url} alt={song.name} style={MiniPlayerStyles.image} />
      <div style={MiniPlayerStyles.info}>
        <div style={MiniPlayerStyles.title}>{song.name}</div>
        <div style={MiniPlayerStyles.artist}>{song.artists.map(artist => artist.name).join(', ')}</div>
      </div>
      <div style={MiniPlayerStyles.controls}>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            togglePlayPause(); 
          }} 
          style={MiniPlayerStyles.button}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onClose(); 
          }} 
          style={MiniPlayerStyles.button}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}