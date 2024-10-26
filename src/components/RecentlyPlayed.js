import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { RecentlyPlayedStyles } from '../styles/RecentlyPlayedStyles';

export default function RecentlyPlayed({ token, userProfile }) {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/song-history/${userProfile.id}`);
        setRecentlyPlayed(response.data);
      } catch (error) {
        console.error('Error fetching recently played songs:', error);
      }
    };

    fetchRecentlyPlayed();
  }, [userProfile.id]);

  return (
    <div style={RecentlyPlayedStyles.container}>
      <h2 style={RecentlyPlayedStyles.title}>Escuchado recientemente</h2>
      <ul style={RecentlyPlayedStyles.songList}>
        {recentlyPlayed.map((song, index) => (
          <li key={`${song.songId}-${index}`} style={RecentlyPlayedStyles.songItem}>
            <div style={RecentlyPlayedStyles.songInfo}>
              <div style={RecentlyPlayedStyles.songName}>{song.songName}</div>
              <div style={RecentlyPlayedStyles.artistName}>{song.artistName}</div>
              <div style={RecentlyPlayedStyles.playedAt}>
                {format(new Date(song.playedAt), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}