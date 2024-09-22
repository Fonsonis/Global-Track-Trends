import React, { useEffect, useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { SongDetailsStyles } from '../styles/SongDetailsStyles'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'

export default function SongDetails({ song, token, player, currentPlaylist, onSongChange, isPremium, deviceId }) {
  const [lyrics, setLyrics] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingDots, setLoadingDots] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef(null)

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
    setLyrics('')
    fetchLyrics()
    setProgress(0)
    setIsPlaying(false)
  }, [song, fetchLyrics])

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingDots(dots => dots.length < 3 ? dots + '.' : '')
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  useEffect(() => {
    if (player) {
      player.addListener('player_state_changed', state => {
        if (state) {
          setIsPlaying(!state.paused)
          setProgress(state.position)
        }
      })
    }
    return () => {
      if (player) {
        player.removeListener('player_state_changed')
      }
    }
  }, [player])

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(prev => prev + 1000)
      }, 1000)
    } else {
      clearInterval(progressInterval.current)
    }
    return () => clearInterval(progressInterval.current)
  }, [isPlaying])

  const togglePlayPause = async () => {
    if (isPremium && deviceId) {
      try {
        if (isPlaying) {
          await axios.put(`https://api.spotify.com/v1/me/player/pause`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        } else {
          await axios.put(`https://api.spotify.com/v1/me/player/play`, {
            uris: [song.uri],
            position_ms: progress
          }, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { device_id: deviceId }
          })
        }
        setIsPlaying(!isPlaying)
        console.log(isPlaying ? 'Paused' : 'Started playing:', song.name)
      } catch (error) {
        console.error('Error toggling play/pause:', error)
      }
    }
  }

  const skipToNext = () => {
    if (currentPlaylist && currentPlaylist.length > 0) {
      const currentIndex = currentPlaylist.findIndex(item => item.track.id === song.id)
      const nextIndex = (currentIndex + 1) % currentPlaylist.length
      onSongChange(currentPlaylist[nextIndex].track)
    }
  }

  const skipToPrevious = () => {
    if (currentPlaylist && currentPlaylist.length > 0) {
      const currentIndex = currentPlaylist.findIndex(item => item.track.id === song.id)
      const previousIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length
      onSongChange(currentPlaylist[previousIndex].track)
    }
  }

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
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
        {isPremium ? (
          <>
            <div style={SongDetailsStyles.progressBarContainer}>
              <div 
                style={{
                  ...SongDetailsStyles.progressBar,
                  width: `${(progress / song.duration_ms) * 100}%`
                }}
              />
            </div>
            <div style={SongDetailsStyles.timeInfo}>
              <span>{formatTime(progress)}</span>
              <span>{formatTime(song.duration_ms)}</span>
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
          </>
        ) : (
          <p style={SongDetailsStyles.premiumMessage}>La reproducción está disponible solo para usuarios Premium</p>
        )}
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