import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SongDetailsStyles } from '../styles/SongDetailsStyles';

function SongDetails({ song, token }) {
  const [lyrics, setLyrics] = useState('');

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const response = await axios.get(`https://api.lyrics.ovh/v1/${song.artists[0].name}/${song.name}`);
        setLyrics(response.data.lyrics);
      } catch (error) {
        console.error('Error al obtener las letras', error);
        setLyrics('Letras no disponibles');
      }
    };

    fetchLyrics();
  }, [song]);

  return (
    <div style={SongDetailsStyles.container}>
      <h2 style={SongDetailsStyles.title}>{song.name}</h2>
      <img src={song.album.images[0].url} alt={song.name} style={SongDetailsStyles.image} />
      <p style={SongDetailsStyles.artistName}>Artista: {song.artists.map(artist => artist.name).join(', ')}</p>
      <h3 style={SongDetailsStyles.lyricsTitle}>Letras:</h3>
      <div style={SongDetailsStyles.lyricsContainer}>
        <pre style={SongDetailsStyles.lyrics}>{lyrics}</pre>
      </div>
    </div>
  );
}

export default SongDetails;