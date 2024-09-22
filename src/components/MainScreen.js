import React, { useState, useEffect, useCallback } from 'react';
import Profile from './Profile';
import Playlists from './Top50Playlists';
import UserPlaylists from './UserPlaylists';
import SongDetails from './SongDetails';
import PlaylistDetails from './PlaylistDetails';
import NavigationBar from './NavigationBar';
import SpotifyPlayer from './SpotifyPlayer';
import MiniPlayer from './MiniPlayer';
import { MainScreenStyles } from '../styles/MainScreenStyles';
import axios from 'axios';

export default function MainScreen({ token, userProfile, isPremium, logout }) {
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#121212');
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSongDetails, setShowSongDetails] = useState(false);
  const [currentView, setCurrentView] = useState('playlists');

  useEffect(() => {
    if (selectedPlaylist && selectedPlaylist.color) {
      setBackgroundColor(selectedPlaylist.color);
    }
  }, [selectedPlaylist]);

  const handleSongSelect = useCallback(async (song, playlistId, songList) => {
    if (isPlaying) {
      try {
        await axios.put(`https://api.spotify.com/v1/me/player/pause`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error pausing current song:', error);
      }
    }

    setSelectedSong(song);
    setCurrentPlaylist(songList);
    setCurrentSongIndex(songList.findIndex(item => item.track.id === song.id));
    setIsPlaying(false);
    setProgress(0);
    setShowSongDetails(true);

    try {
      await axios.put(`https://api.spotify.com/v1/me/player/play`, {
        uris: [song.uri],
        position_ms: 0
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { device_id: deviceId }
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing new song:', error);
    }
  }, [isPlaying, token, deviceId]);

  const handlePlaylistSelect = useCallback((playlist) => {
    setSelectedPlaylist(playlist);
    setShowSongDetails(false);
  }, []);

  const handleSongChange = useCallback((direction) => {
    if (currentPlaylist.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentSongIndex + 1) % currentPlaylist.length;
    } else {
      newIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    }

    const newSong = currentPlaylist[newIndex].track;
    handleSongSelect(newSong, selectedPlaylist?.id, currentPlaylist);
  }, [currentPlaylist, currentSongIndex, handleSongSelect, selectedPlaylist]);

  const togglePlayPause = useCallback(async () => {
    if (isPremium && deviceId) {
      try {
        if (isPlaying) {
          await axios.put(`https://api.spotify.com/v1/me/player/pause`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } else {
          await axios.put(`https://api.spotify.com/v1/me/player/play`, {
            uris: [selectedSong.uri],
            position_ms: progress
          }, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { device_id: deviceId }
          });
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error toggling play/pause:', error);
      }
    }
  }, [isPremium, deviceId, isPlaying, token, selectedSong, progress]);

  const handleSeek = useCallback(async (position) => {
    if (isPremium && deviceId) {
      try {
        await axios.put(`https://api.spotify.com/v1/me/player/seek`, null, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { position_ms: position, device_id: deviceId }
        });
        setProgress(position);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  }, [isPremium, deviceId, token]);

  const updateProgress = useCallback((newProgress) => {
    setProgress(newProgress);
  }, []);

  const handleMiniPlayerClick = useCallback(() => {
    setShowSongDetails(true);
  }, []);

  const handleCloseMiniPlayer = useCallback(async () => {
    if (isPlaying) {
      try {
        await axios.put(`https://api.spotify.com/v1/me/player/pause`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error pausing song:', error);
      }
    }
    setSelectedSong(null);
    setIsPlaying(false);
    setProgress(0);
  }, [isPlaying, token]);

  const handlePlayerReady = useCallback((player, device_id) => {
    setPlayer(player);
    setDeviceId(device_id);
  }, []);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    setSelectedPlaylist(null);
    setShowSongDetails(false);
    if (view === 'analytics') {
      setSelectedSong(null);
      if (isPlaying) {
        axios.put(`https://api.spotify.com/v1/me/player/pause`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(error => console.error('Error pausing song:', error));
      }
      setIsPlaying(false);
      setProgress(0);
      alert('La sección de Analíticas está en construcción.');
    }
  }, [token, isPlaying]);

  return (
    <div style={MainScreenStyles.container}>
      <div style={MainScreenStyles.leftColumn}>
        <Profile userProfile={userProfile} isPremium={isPremium} logout={logout} />
        <NavigationBar currentView={currentView} onViewChange={handleViewChange} />
      </div>
      <div style={{
        ...MainScreenStyles.mainContent,
        ...MainScreenStyles.scrollbarStyles,
        backgroundColor: backgroundColor,
      }}>
        <div style={MainScreenStyles.contentColumn}>
          {currentView === 'playlists' && (
            <Playlists 
              token={token} 
              onSongSelect={handleSongSelect} 
              onPlaylistSelect={handlePlaylistSelect}
              selectedPlaylistId={selectedPlaylist?.id}
            />
          )}
          {currentView === 'userPlaylists' && (
            <UserPlaylists 
              token={token} 
              onSongSelect={handleSongSelect} 
              onPlaylistSelect={handlePlaylistSelect}
              selectedPlaylistId={selectedPlaylist?.id}
            />
          )}
          {currentView === 'analytics' && (
            <div style={MainScreenStyles.analyticsPlaceholder}>
              <h2>Analíticas</h2>
              <p>Esta sección está en construcción.</p>
            </div>
          )}
        </div>
      </div>
      <div style={{
        ...MainScreenStyles.rightColumn,
        ...MainScreenStyles.scrollbarStyles,
        backgroundColor: backgroundColor,
      }}>
        {showSongDetails && selectedSong && currentView !== 'analytics' ? (
          <SongDetails 
            song={selectedSong} 
            token={token} 
            player={player}
            deviceId={deviceId}
            currentPlaylist={currentPlaylist}
            onSongChange={handleSongChange}
            isPremium={isPremium}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            progress={progress}
            onSeek={handleSeek}
            updateProgress={updateProgress}
          />
        ) : selectedPlaylist && currentView !== 'analytics' ? (
          <PlaylistDetails playlist={selectedPlaylist} />
        ) : null}
        {selectedSong && !showSongDetails && currentView !== 'analytics' && (
          <MiniPlayer 
            song={selectedSong}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            onClick={handleMiniPlayerClick}
            onClose={handleCloseMiniPlayer}
          />
        )}
      </div>
      {isPremium && <SpotifyPlayer token={token} onPlayerReady={handlePlayerReady} />}
    </div>
  );
}