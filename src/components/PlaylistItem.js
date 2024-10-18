// PlaylistItem.js
import React from 'react';
import { Trophy } from 'lucide-react';
import { PlaylistsStyles } from '../styles/PlaylistsStyles';

export default function PlaylistItem({ 
  playlist, 
  isSelected, 
  isHovered, 
  backgroundColor, 
  tracks, 
  expandedTracks,
  lastWeekTracks,
  onTogglePlaylist, 
  onToggleTrackExpansion, 
  onSongClick,
  showPositionChange = false,
  showTrophies = false
}) {
  
  // Calculo de posiciones top 3
  const getPositionChange = (track, index) => {
    if (!showPositionChange) return 'transparent';
    const lastWeekIndex = lastWeekTracks?.findIndex(t => t.track.id === track.id);
    if (lastWeekIndex === undefined) return 'gray';
    if (index < lastWeekIndex) return 'green';
    if (index > lastWeekIndex) return 'red';
    return 'gray';
  };

  // Obtener medalla en cada caso
  const getMedalColor = (position) => {
    if (!showTrophies) return null;
    switch(position) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return '#CD7F32';
      default: return null;
    }
  };

  return (
    <div 
      style={{
        ...PlaylistsStyles.playlistCloud,
        ...(isSelected ? PlaylistsStyles.selectedPlaylist : {}),
        backgroundColor: backgroundColor || 'rgba(255, 255, 255, 0.1)',
        opacity: isSelected ? 1 : 0.7,
        transition: 'all 0.3s ease',
        transform: isHovered && !isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered && !isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
      }}
      onClick={() => onTogglePlaylist(playlist)}
    >
      {isSelected ? (
        <div style={PlaylistsStyles.expandedPlaylist}>
          <div style={PlaylistsStyles.expandedHeader}>
            <img 
              src={playlist.images[0].url} 
              alt={playlist.name} 
              style={PlaylistsStyles.playlistImageSmall}
            />
            <h3 style={PlaylistsStyles.playlistTitleExpanded}>{playlist.name}</h3>
          </div>
          {tracks && (
            <div style={PlaylistsStyles.trackListContainer}>
              <h4 style={PlaylistsStyles.trackListTitle}>Canciones:</h4>
              <ul style={PlaylistsStyles.trackList}>
                {tracks.slice(0, expandedTracks ? 50 : 10).map((item, index) => (
                  <li 
                    key={item.track.id} 
                    style={{...PlaylistsStyles.trackItem, cursor: 'pointer'}}
                    onClick={(e) => onSongClick(item.track, playlist.id, e)}
                  >
                    {showPositionChange && (
                      <div style={{
                        ...PlaylistsStyles.positionIndicator,
                        backgroundColor: getPositionChange(item.track, index)
                      }}>
                        {index + 1}
                      </div>
                    )}
                    {showTrophies && getMedalColor(index) && (
                      <Trophy 
                        size={16} 
                        style={{
                          ...PlaylistsStyles.medalIcon,
                          color: getMedalColor(index)
                        }} 
                      />
                    )}
                    <span style={PlaylistsStyles.trackName}>
                      {item.track.name}
                    </span>
                    <span style={PlaylistsStyles.artistName}>
                      {item.track.artists.map(artist => artist.name).join(', ')}
                    </span>
                  </li>
                ))}
              </ul>
              {tracks.length > 10 && (
                <button 
                  onClick={(e) => onToggleTrackExpansion(playlist.id, e)} 
                  style={PlaylistsStyles.expandButton}
                >
                  {expandedTracks ? 'Mostrar menos' : 'Mostrar más'}
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={PlaylistsStyles.collapsedPlaylist}>
          <img 
            src={playlist.images[0].url} 
            alt={playlist.name} 
            style={PlaylistsStyles.playlistImage}
          />
          <h3 style={PlaylistsStyles.playlistTitle}>{playlist.name}</h3>
        </div>
      )}
    </div>
  );
}