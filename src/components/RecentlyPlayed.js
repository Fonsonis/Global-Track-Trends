import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { RecentlyPlayedStyles } from '../styles/RecentlyPlayedStyles';
import { Trash2 } from 'lucide-react';

export default function RecentlyPlayed({ token, userProfile, onSongSelect }) {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const fetchRecentlyPlayed = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/song-history/${userProfile.id}`);
      setRecentlyPlayed(response.data);
    } catch (error) {
      console.error('Error al obtener las canciones reproducidas recientemente:', error);
    }
  };

  useEffect(() => {
    fetchRecentlyPlayed();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.id]);

  const handleSongClick = async (song) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/tracks/${song.songId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Actualizamos el estado local para reflejar la reproducción inmediatamente
      setRecentlyPlayed(prevSongs => {
        const updatedSongs = prevSongs.filter(s => s._id !== song._id);
        return [{ ...song, playedAt: new Date() }, ...updatedSongs];
      });

      // Llamamos a onSongSelect con isFromHistory = true
      onSongSelect(response.data, null, [{ track: response.data }], true);
    } catch (error) {
      console.error('Error al obtener los detalles de la canción:', error);
    }
  };

  const handleDeleteSong = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/song-history/${userProfile.id}/${id}`);
      setRecentlyPlayed(recentlyPlayed.filter(song => song._id !== id));
    } catch (error) {
      console.error('Error al eliminar la canción del historial:', error);
    }
  };

  return (
    <div style={RecentlyPlayedStyles.container}>
      <h2 style={RecentlyPlayedStyles.title}>Escuchado recientemente</h2>
      <ul style={RecentlyPlayedStyles.songList}>
        {recentlyPlayed.map((song) => (
          <li 
            key={song._id} 
            style={{...RecentlyPlayedStyles.songItem, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
          >
            <div style={RecentlyPlayedStyles.songInfo} onClick={() => handleSongClick(song)}>
              <div style={RecentlyPlayedStyles.songName}>{song.songName}</div>
              <div style={RecentlyPlayedStyles.artistName}>{song.artistName}</div>
              <div style={RecentlyPlayedStyles.playedAt}>
                {format(new Date(song.playedAt), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSong(song._id);
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
                marginLeft: 'auto'
              }}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}