import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { SongDetailsStyles } from '../styles/SongDetailsStyles';

export default function SongDetails({ song, token }) {
  const [lyrics, setLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  const fetchLyrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.artists[0].name)}/${encodeURIComponent(song.name)}`);
      setLyrics(response.data.lyrics || 'Letra no disponible');
    } catch (error) {
      console.error('Error al obtener las letras', error);
      setLyrics('Letra no disponible');
    }
    setIsLoading(false);
  }, [song]);

  useEffect(() => {
    setLyrics(''); // Resetear las letras al cambiar de canción
    fetchLyrics();
  }, [song, fetchLyrics]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingDots(dots => dots.length < 3 ? dots + '.' : '');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div style={SongDetailsStyles.container}>
      <div style={SongDetailsStyles.header}>
        <img src={song.album.images[0].url} alt={song.name} style={SongDetailsStyles.image} />
        <div style={SongDetailsStyles.songInfo}>
          <h2 style={SongDetailsStyles.title}>{song.name}</h2>
          <p style={SongDetailsStyles.artistName}>Artista: {song.artists.map(artist => artist.name).join(', ')}</p>
        </div>
      </div>
      <div style={SongDetailsStyles.lyricsContainer}>
        <h3 style={SongDetailsStyles.lyricsTitle}>Letras:</h3>
        <div style={SongDetailsStyles.lyricsWrapper}>
          {isLoading ? (
            <p style={SongDetailsStyles.lyrics}>Cargando{loadingDots}</p>
          ) : (
            <pre style={SongDetailsStyles.lyrics}>{lyrics}</pre>
          )}
        </div>
      </div>
    </div>
  );
}