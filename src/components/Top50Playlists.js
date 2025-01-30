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

  // Obtener todas las playlists
  const fetchAllPlaylists = async (initialUrl) => {
    let allPlaylists = [];
    let nextUrl = initialUrl;

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data?.playlists?.items) {
          allPlaylists.push(...data.playlists.items);
        }

        nextUrl = data.playlists.next; 
      }
    } catch (error) {
      console.error("Error al obtener las playlists paginadas:", error);
    }

    return allPlaylists;
  };

  // Obtener todas las playlists y filtrarlas
  useEffect(() => {
    const fetchPlaylists = async () => {
      // Definimos los tiempos de cache
      const THIRTY_MINUTES = 30 * 60 * 1000;
      const CACHE_KEY = 'playlistsCache';
      const CACHE_TIME_KEY = 'playlistsCacheTime';

      // Comprobamos en localStorage si tenemos playlists cacheadas
      const cachedPlaylists = localStorage.getItem(CACHE_KEY);
      const cachedTime = localStorage.getItem(CACHE_TIME_KEY);

      // Si existen playlists en cache y no han pasado 30 min, las usamos
      if (cachedPlaylists && cachedTime && (Date.now() - cachedTime < THIRTY_MINUTES)) {
        console.log("Usando playlists cacheadas");
        const sortedPlaylists = JSON.parse(cachedPlaylists);

        setPlaylists(sortedPlaylists);

        sortedPlaylists.forEach((playlist) => {
          const imageUrl = playlist?.images?.[0]?.url;
          if (imageUrl) {
            getAverageColor(imageUrl).then((color) => {
              setPlaylistColors((prev) => ({
                ...prev,
                [playlist.id]: color,
              }));
            });
          }
        });

        return;
      }

      const initialUrl = `https://api.spotify.com/v1/search?q="Top 50"&type=playlist&limit=50`;
      const allPlaylists = await fetchAllPlaylists(initialUrl);

      console.log("Todas las playlists obtenidas:", allPlaylists);

      const nonNullPlaylists = allPlaylists.filter((playlist) => {
        if (!playlist) {
          return false;
        }
        return true;
      });

      console.log("Playlist validas", nonNullPlaylists);

      const filteredPlaylists = nonNullPlaylists.filter((playlist) => {
        const name = playlist.name ? playlist.name.toLowerCase() : '';
        const isTop50 = name.startsWith('top 50: ') || name.startsWith('top 50 -');
        return isTop50;
      });

      console.log("Playlists filtradas:", filteredPlaylists);

      const sortedPlaylists = filteredPlaylists.sort((a, b) => {
        if (a.name.toLowerCase().includes("global")) return -1;
        if (b.name.toLowerCase().includes("global")) return 1;
        return a.name.localeCompare(b.name);
      });

      setPlaylists(sortedPlaylists);

      localStorage.setItem(CACHE_KEY, JSON.stringify(sortedPlaylists));
      localStorage.setItem(CACHE_TIME_KEY, Date.now());

      sortedPlaylists.forEach((playlist) => {
        const imageUrl = playlist?.images?.[0]?.url;
        if (imageUrl) {
          getAverageColor(imageUrl).then((color) => {
            setPlaylistColors((prev) => ({
              ...prev,
              [playlist.id]: color,
            }));
          });
        }
      });
    };

    fetchPlaylists();
  }, [token]);

  // Función para alternar la selección de una playlist
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
            params: { limit: 50 },
          }),
          axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { limit: 50 },
          }),
        ]);

        setPlaylistTracks((prev) => ({
          ...prev,
          [playlistId]: currentResponse.data.items,
        }));

        const shuffledTracks = [...lastWeekResponse.data.items].sort(
          () => Math.random() - 0.5
        );
        setLastWeekTracks((prev) => ({
          ...prev,
          [playlistId]: shuffledTracks,
        }));
      } catch (error) {
        console.error("Error al obtener las pistas de la lista de reproducción", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("spotify_token");
          window.location.href = "/";
        }
      }
    }

    onPlaylistSelect({ ...playlist, color: playlistColors[playlistId] });
  };

  // Expandir/reducir playlist
  const toggleTrackExpansion = useCallback((playlistId, e) => {
    e.stopPropagation();
    setExpandedTracks((prev) => ({
      ...prev,
      [playlistId]: !prev[playlistId],
    }));
  }, []);

  // Seleccionar canción
  const handleSongClick = useCallback(
    (song, playlistId, e) => {
      e.stopPropagation();
      onSongSelect(song, playlistId, playlistTracks[playlistId]);
    },
    [onSongSelect, playlistTracks]
  );

  return (
    <div style={PlaylistsStyles.container}>
      {playlists.map((playlist, index) => (
        <PlaylistItem
          key={`${playlist.id}-${index}`}
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
