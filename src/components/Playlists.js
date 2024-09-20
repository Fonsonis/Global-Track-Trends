import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { PlaylistsStyles } from '../styles/PlaylistsStyles';
import { getAverageColor } from '../utils/colorUtils';
import { Trophy } from 'lucide-react';

export default function Component({ token, onSongSelect, onPlaylistSelect, selectedPlaylistId }) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [lastWeekTracks, setLastWeekTracks] = useState({});
  const [expandedTracks, setExpandedTracks] = useState({});
  const [playlistColors, setPlaylistColors] = useState({});
  const [hoveredPlaylistId, setHoveredPlaylistId] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: 'Top 50',
            type: 'playlist',
            limit: 50
          }
        });

        const allPlaylists = response.data.playlists.items;
        const filteredPlaylists = allPlaylists.filter(playlist => 
          playlist.name.includes('Top 50 -') && playlist.owner.id === 'spotify'
        );

        const sortedPlaylists = filteredPlaylists.sort((a, b) => {
          if (a.name.includes('Global')) return -1;
          if (b.name.includes('Global')) return 1;
          return a.name.localeCompare(b.name);
        });

        setPlaylists(sortedPlaylists);
        
        sortedPlaylists.forEach(playlist => {
          if (playlist.images[0]) {
            getAverageColor(playlist.images[0].url).then(color => {
              setPlaylistColors(prev => ({ ...prev, [playlist.id]: color }));
            });
          }
        });
      } catch (error) {
        console.error('Error al obtener las listas de reproducción', error);
      }
    };

    fetchPlaylists();
  }, [token]);

  const togglePlaylist = async (playlist) => {
    const playlistId = playlist.id;

    if (selectedPlaylistId === playlistId) {
      onPlaylistSelect(null);
      return;
    }

    if (!playlistTracks[playlistId]) {
      try {
        const currentResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 50 }
        });
        setPlaylistTracks(prev => ({ ...prev, [playlistId]: currentResponse.data.items }));

        const lastWeekResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 50 }
        });
        const shuffledTracks = [...lastWeekResponse.data.items].sort(() => Math.random() - 0.5);
        setLastWeekTracks(prev => ({ ...prev, [playlistId]: shuffledTracks }));
      } catch (error) {
        console.error('Error al obtener las pistas de la lista de reproducción', error);
      }
    }

    onPlaylistSelect({...playlist, color: playlistColors[playlistId]});
  };

  const toggleTrackExpansion = (playlistId, e) => {
    e.stopPropagation();
    setExpandedTracks(prev => ({ ...prev, [playlistId]: !prev[playlistId] }));
  };

  const handleSongClick = useCallback((song, playlistId, e) => {
    e.stopPropagation();
    onSongSelect(song, playlistId, playlistTracks[playlistId]);
  }, [onSongSelect, playlistTracks]);

  const getPositionChange = (track, index, playlistId) => {
    const lastWeekIndex = lastWeekTracks[playlistId]?.findIndex(t => t.track.id === track.id);
    if (lastWeekIndex === undefined) return 'gray';
    if (index < lastWeekIndex) return 'green';
    if (index > lastWeekIndex) return 'red';
    return 'gray';
  };

  const getMedalColor = (position) => {
    switch(position) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return '#CD7F32';
      default: return null;
    }
  };

  return (
    <div style={PlaylistsStyles.container}>
      {playlists.map((playlist) => (
        <div 
          key={playlist.id} 
          style={{
            ...PlaylistsStyles.playlistCloud,
            ...(selectedPlaylistId === playlist.id ? PlaylistsStyles.selectedPlaylist : {}),
            backgroundColor: playlistColors[playlist.id] || 'rgba(255, 255, 255, 0.1)',
            opacity: selectedPlaylistId && selectedPlaylistId !== playlist.id ? 0.7 : 1,
            transition: 'all 0.3s ease',
            transform: hoveredPlaylistId === playlist.id && selectedPlaylistId !== playlist.id ? 'scale(1.02)' : 'scale(1)',
            boxShadow: hoveredPlaylistId === playlist.id && selectedPlaylistId !== playlist.id ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
          }}
          onClick={() => togglePlaylist(playlist)}
          onMouseEnter={() => setHoveredPlaylistId(playlist.id)}
          onMouseLeave={() => setHoveredPlaylistId(null)}
        >
          {selectedPlaylistId === playlist.id ? (
            <div style={PlaylistsStyles.expandedPlaylist}>
              <div style={PlaylistsStyles.expandedHeader}>
                <img 
                  src={playlist.images[0].url} 
                  alt={playlist.name} 
                  style={PlaylistsStyles.playlistImageSmall}
                />
                <h3 style={PlaylistsStyles.playlistTitleExpanded}>{playlist.name}</h3>
              </div>
              {playlistTracks[playlist.id] && (
                <div style={PlaylistsStyles.trackListContainer}>
                  <h4 style={PlaylistsStyles.trackListTitle}>Canciones:</h4>
                  <ul style={PlaylistsStyles.trackList}>
                    {playlistTracks[playlist.id].slice(0, expandedTracks[playlist.id] ? 50 : 10).map((item, index) => (
                      <li 
                        key={item.track.id} 
                        style={{...PlaylistsStyles.trackItem, cursor: 'pointer'}}
                        onClick={(e) => handleSongClick(item.track, playlist.id, e)}
                      >
                        <div style={{
                          ...PlaylistsStyles.positionIndicator,
                          backgroundColor: getPositionChange(item.track, index, playlist.id)
                        }}>
                          {index + 1}
                        </div>
                        {getMedalColor(index) && (
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
                  {playlistTracks[playlist.id].length > 10 && (
                    <button 
                      onClick={(e) => toggleTrackExpansion(playlist.id, e)} 
                      style={PlaylistsStyles.expandButton}
                    >
                      {expandedTracks[playlist.id] ? 'Mostrar menos' : 'Mostrar más'}
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
      ))}
    </div>
  );
}