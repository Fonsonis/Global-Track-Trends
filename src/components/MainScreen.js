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
  }, [isPlaying, token]);

  // ... rest of the component logic

  return (
    <div style={{...MainScreenStyles.container, backgroundColor, minHeight: '100vh'}}>
      <NavigationBar currentView={currentView} onViewChange={setCurrentView} />
      <div style={{...MainScreenStyles.content, padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px'}}>
        {currentView === 'playlists' && (
          <Playlists token={token} onPlaylistSelect={setSelectedPlaylist} onSongSelect={handleSongSelect} />
        )}
        {currentView === 'userPlaylists' && (
          <UserPlaylists token={token} onPlaylistSelect={setSelectedPlaylist} onSongSelect={handleSongSelect} />
        )}
        {selectedPlaylist && <PlaylistDetails playlist={selectedPlaylist} />}
        {showSongDetails && selectedSong && (
          <SongDetails
            song={selectedSong}
            onClose={() => setShowSongDetails(false)}
          />
        )}
      </div>
      {selectedSong && (
        <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000}}>
          <MiniPlayer
            song={selectedSong}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            onClick={() => setShowSongDetails(true)}
            onClose={() => setSelectedSong(null)}
          />
        </div>
      )}
      {isPremium && (
        <SpotifyPlayer
          token={token}
          uris={currentPlaylist.map(item => item.track.uri)}
          offset={currentSongIndex}
          onPlayerReady={handlePlayerReady}
          onPlayerStateChanged={handlePlayerStateChanged}
        />
      )}
    </div>
  );
}