import React, { useState } from 'react';
import Profile from './Profile';
import Playlists from './Playlists';
import SongDetails from './SongDetails';
import PlaylistDetails from './PlaylistDetails';
import { MainScreenStyles } from '../styles/MainScreenStyles';

function MainScreen({ token, userProfile, logout }) {
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setSelectedPlaylist(null);
  };

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
    setSelectedSong(null);
  };

  return (
    <div style={MainScreenStyles.container}>
      <div style={MainScreenStyles.profileSection}>
        <Profile userProfile={userProfile} logout={logout} />
      </div>
      <div style={MainScreenStyles.playlistsSection}>
        <Playlists token={token} onSongSelect={handleSongSelect} onPlaylistSelect={handlePlaylistSelect} />
      </div>
      {selectedSong && (
        <div style={MainScreenStyles.detailsSection}>
          <SongDetails song={selectedSong} token={token} />
        </div>
      )}
      {selectedPlaylist && (
        <div style={MainScreenStyles.detailsSection}>
          <PlaylistDetails playlist={selectedPlaylist} />
        </div>
      )}
      {!selectedSong && !selectedPlaylist && (
        <div style={MainScreenStyles.emptyDetailsSection}>
          Selecciona una canción o playlist para ver los detalles
        </div>
      )}
    </div>
  );
}

export default MainScreen;