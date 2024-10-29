import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { PlaylistsStyles } from '../styles/PlaylistsStyles';
import { getAverageColor } from '../utils/colorUtils';
import PlaylistItem from './PlaylistItem';

// Define the base URL for API calls
const API_BASE_URL = 'http://localhost:5001'; // Update this to match your server's address and port

export default function Playlists({ token, onSongSelect, onPlaylistSelect, selectedPlaylistId }) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [lastWeekTracks, setLastWeekTracks] = useState({});
  const [expandedTracks, setExpandedTracks] = useState({});
  const [playlistColors, setPlaylistColors] = useState({});
  const [hoveredPlaylistId, setHoveredPlaylistId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use the correct API URL
        const cachedResponse = await axios.get(`${API_BASE_URL}/api/cached-playlists`);
        
        if (cachedResponse.data && cachedResponse.data.playlists) {
          console.log("Usando playlists en caché");
          setPlaylists(cachedResponse.data.playlists);
          setPlaylistColors(cachedResponse.data.playlistColors || {});
        } else {
          console.log("Obteniendo nuevas playlists de Spotify");
          let allPlaylists = [];
          let nextUrl = 'https://api.spotify.com/v1/users/spotify/playlists?limit=50';

          while (nextUrl) {
            const response = await fetch(nextUrl, {
              headers: { "Authorization": `Bearer ${token}` },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            allPlaylists = [...allPlaylists, ...data.items];
            nextUrl = data.next;

            console.log(`Obtenidas ${allPlaylists.length} playlists hasta ahora.`);
          }

          console.log("Total de playlists obtenidas:", allPlaylists.length);

          const filteredPlaylists = allPlaylists.filter(playlist => 
            (playlist.name.toLowerCase().includes('top 50') || playlist.name.includes('50:')) &&
            playlist.owner.id === 'spotify'
          );

          console.log("Playlists Top 50 filtradas:", filteredPlaylists.length);

          const sortedPlaylists = filteredPlaylists.sort((a, b) => {
            if (a.name.toLowerCase().includes('global')) return -1;
            if (b.name.toLowerCase().includes('global')) return 1;
            return a.name.localeCompare(b.name);
          });

          console.log("Playlists ordenadas:", sortedPlaylists.length);

          setPlaylists(sortedPlaylists);
          
          const colors = {};
          for (const playlist of sortedPlaylists) {
            if (playlist.images[0]) {
              const color = await getAverageColor(playlist.images[0].url);
              colors[playlist.id] = color;
            }
          }
          setPlaylistColors(colors);

          // Cache the playlists
          await axios.post(`${API_BASE_URL}/api/cache-playlists`, { 
            playlists: sortedPlaylists,
            playlistColors: colors
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener las listas de reproducción', error);
        setError('Error al cargar las playlists. Por favor, intenta de nuevo más tarde.');
        setIsLoading(false);
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

  const toggleTrackExpansion = useCallback((playlistId, e) => {
    e.stopPropagation();
    setExpandedTracks(prev => ({ ...prev, [playlistId]: !prev[playlistId] }));
  }, []);

  const handleSongClick = useCallback((song, playlistId, e) => {
    e.stopPropagation();
    onSongSelect(song, playlistId, playlistTracks[playlistId]);
  }, [onSongSelect, playlistTracks]);

  if (isLoading) {
    return <div style={PlaylistsStyles.container}>Cargando playlists...</div>;
  }

  if (error) {
    return <div style={PlaylistsStyles.container}>{error}</div>;
  }

  return (
    <div style={PlaylistsStyles.container}>
      {playlists.length === 0 ? (
        <p>No se encontraron playlists Top 50.</p>
      ) : (
        <>
          <p>Total de playlists Top 50: {playlists.length}</p>
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
        </>
      )}
    </div>
  );
}