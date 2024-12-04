// Playlists.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { PlaylistsStyles } from '../styles/PlaylistsStyles';
import { getAverageColor } from '../utils/colorUtils';
import PlaylistItem from './PlaylistItem';

export default function Playlists({ token, onSongSelect, onPlaylistSelect, selectedPlaylistId }) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [lastWeekTracks, setLastWeekTracks] = useState({});
  const [expandedTracks, setExpandedTracks] = useState({});
  const [playlistColors, setPlaylistColors] = useState({});
  const [hoveredPlaylistId, setHoveredPlaylistId] = useState(null);

  // Obtener playlist
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=Top 50&type=playlist&limit=50`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
    
        const data = await response.json();
    
        // Ensure we have playlists data
        if (!data?.playlists?.items) {
          console.error('No playlist items found in response');
          return;
        }
    
        // Filter for valid Top 50 playlists
        const filteredPlaylists = data.playlists.items.filter(playlist => 
          playlist && 
          playlist.name && 
          typeof playlist.name === 'string' &&
          (playlist.name.includes('Top 50'))
        );
    
        // Sort playlists (Global first, then alphabetically)
        const sortedPlaylists = filteredPlaylists.sort((a, b) => {
          if (a.name.toLowerCase().includes('global')) return -1;
          if (b.name.toLowerCase().includes('global')) return 1;
          return a.name.localeCompare(b.name);
        });
    
        console.log('Filtered and sorted playlists:', sortedPlaylists);
    
        setPlaylists(sortedPlaylists);
        
        // Process colors for valid playlists
        sortedPlaylists.forEach(playlist => {
          if (playlist?.images?.[0]?.url) {
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
        const [currentResponse, lastWeekResponse] = await Promise.all([
          axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 50 }
          }),
          axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 50 }
          })
        ]);
        
        setPlaylistTracks(prev => ({ ...prev, [playlistId]: currentResponse.data.items }));
        
        const shuffledTracks = [...lastWeekResponse.data.items].sort(() => Math.random() - 0.5);
        setLastWeekTracks(prev => ({ ...prev, [playlistId]: shuffledTracks }));
      } catch (error) {
        console.error('Error al obtener las pistas de la lista de reproducción', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('spotify_token');
          window.location.href = '/';
        }
      }
    }

    onPlaylistSelect({...playlist, color: playlistColors[playlistId]});
  };

  // Expandir/reducir playlist
  const toggleTrackExpansion = useCallback((playlistId, e) => {
    e.stopPropagation();
    setExpandedTracks(prev => ({ ...prev, [playlistId]: !prev[playlistId] }));
  }, []);

  // Seleccionar canción
  const handleSongClick = useCallback((song, playlistId, e) => {
    e.stopPropagation();
    onSongSelect(song, playlistId, playlistTracks[playlistId]);
  }, [onSongSelect, playlistTracks]);

  return (
    <div style={PlaylistsStyles.container}>
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.id}
          playlist={playlist}
          isSelected={selectedPlaylistId === playlist.id}
          isHovered={hoveredPlaylistId === playlist.id}
          backgroundColor={playlistColors[playlist.id]}
          tracks={playlistTracks[playlist.id]}
          expandedTracks={expandedTracks[playlist.id]}
          lastWeekTracks={lastWeekTracks[playlist.id]}
          onTogglePlaylist={togglePlaylist}
          onToggleTrackExpansion={toggleTrackExpansion}
          onSongClick={handleSongClick}
          showPositionChange={true}
          showTrophies={true}
        />
      ))}
    </div>
  );
}