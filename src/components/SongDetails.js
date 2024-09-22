import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { SongDetailsStyles } from '../styles/SongDetailsStyles'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

export default function Component({ song, token, player, currentPlaylist, onSongChange }) {
  const [lyrics, setLyrics] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingDots, setLoadingDots] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  const fetchLyrics = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.artists[0].name)}/${encodeURIComponent(song.name)}`)
      setLyrics(response.data.lyrics || 'Letra no disponible')
    } catch (error) {
      console.error('Error al obtener las letras', error)
      setLyrics('Letra no disponible')
    }
    setIsLoading(false)
  }, [song])

  useEffect(() => {
    setLyrics('') // Resetear las letras al cambiar de canción
    fetchLyrics()
  }, [song, fetchLyrics])

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingDots(dots => dots.length < 3 ? dots + '.' : '')
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  const togglePlayPause = () => {
    if (player) {
      player.togglePlay().then(() => {
        setIsPlaying(!isPlaying)
      })
    }
  }

  const skipToNext = () => {
    onSongChange('next')
  }

  const skipToPrevious = () => {
    onSongChange('previous')
  }

  return (
    <div style={SongDetailsStyles.container}>
      <div style={SongDetailsStyles.fixedContent}>
        <div style={SongDetailsStyles.songInfo}>
          <img src={song.album.images[0].url} alt={song.name} style={SongDetailsStyles.image} />
          <div style={SongDetailsStyles.textInfo}>
            <h2 style={SongDetailsStyles.title}>{song.name}</h2>
            <p style={SongDetailsStyles.artistName}>{song.artists.map(artist => artist.name).join(', ')}</p>
          </div>
        </div>
        <div style={SongDetailsStyles.playerControls}>
          <button onClick={skipToPrevious} style={SongDetailsStyles.controlButton} aria-label="Canción anterior">
            <SkipBack size={24} />
          </button>
          <button onClick={togglePlayPause} style={SongDetailsStyles.controlButton} aria-label={isPlaying ? "Pausar" : "Reproducir"}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button onClick={skipToNext} style={SongDetailsStyles.controlButton} aria-label="Siguiente canción">
            <SkipForward size={24} />
          </button>
        </div>
      </div>
      <div style={SongDetailsStyles.lyricsSection}>
        <h3 style={SongDetailsStyles.lyricsTitle}>Letras:</h3>
        <div style={SongDetailsStyles.lyricsContainer}>
          <div style={SongDetailsStyles.lyricsWrapper}>
            {isLoading ? (
              <p style={SongDetailsStyles.loadingText}>Cargando{loadingDots}</p>
            ) : (
              <pre style={SongDetailsStyles.lyrics}>{lyrics}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}