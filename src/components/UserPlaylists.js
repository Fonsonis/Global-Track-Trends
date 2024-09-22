// UserPlaylists.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PlaylistsStyles } from '../styles/PlaylistsStyles';
import PlaylistItem from './PlaylistItem';

export default function UserPlaylists({ token, onSongSelect, onPlaylistSelect, selectedPlaylistId }) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [expandedTracks, setExpandedTracks] = useState({});
  const [hoveredPlaylistId, setHoveredPlaylistId] = useState(null);

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      try {
        let response = await axios.get('https://api.spotify.com/v1/me/playlists', {
          headers: { "Authorization": `Bearer ${token}` },
        });

        setPlaylists(response.data.items);
      } catch (error) {
        console.error('Error al obtener las listas de reproducción del usuario', error);
      }
    };

    fetchUserPlaylists();
  }, [token]);

  const togglePlaylist = async (playlist) => {
    const playlistId = playlist.id;

    if (selectedPlaylistId === playlistId) {
      onPlaylistSelect(null);
      return;
    }

    if (!playlistTracks[playlistId]) {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 50 }
        });
        setPlaylistTracks(prev => ({ ...prev, [playlistId]: response.data.items }));
      } catch (error) {
        console.error('Error al obtener las pistas de la lista de reproducción', error);
      }
    }

    onPlaylistSelect(playlist);
  };

  const toggleTrackExpansion = useCallback((playlistId, e) => {
    e.stopPropagation();
    setExpandedTracks(prev => ({ ...prev, [playlistId]: !prev[playlistId] }));
  }, []);

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
          backgroundColor="rgba(255, 255, 255, 0.1)"
          tracks={playlistTracks[playlist.id]}
          expandedTracks={expandedTracks[playlist.id]}
          onTogglePlaylist={togglePlaylist}
          onToggleTrackExpansion={toggleTrackExpansion}
          onSongClick={handleSongClick}
          showPositionChange={false}
          showTrophies={false}
        />
      ))}
    </div>
  );
}