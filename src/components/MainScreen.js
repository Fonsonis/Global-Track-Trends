import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import Playlists from './Playlists';
import SongDetails from './SongDetails';
import PlaylistDetails from './PlaylistDetails';
import NavigationBar from './NavigationBar';
import { MainScreenStyles } from '../styles/MainScreenStyles';

export default function MainScreen({ token, userProfile, logout }) {
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#121212');
  const [prevBackgroundColor, setPrevBackgroundColor] = useState('#121212');

  useEffect(() => {
    if (selectedPlaylist && selectedPlaylist.color) {
      setPrevBackgroundColor(backgroundColor);
      setBackgroundColor(selectedPlaylist.color);
    } else {
      setPrevBackgroundColor(backgroundColor);
      setBackgroundColor('#121212');
    }
  }, [selectedPlaylist]);

  const handleSongSelect = (song, playlistId) => {
    setSelectedSong(song);
  };

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
    setSelectedSong(null);
  };

  return (
    <div style={MainScreenStyles.container}>
      <div 
        style={{
          ...MainScreenStyles.backgroundTransition,
          backgroundColor: prevBackgroundColor,
          opacity: 0,
        }}
      />
      <div 
        style={{
          ...MainScreenStyles.backgroundTransition,
          backgroundColor: backgroundColor,
          opacity: 1,
        }}
      />
      <div style={MainScreenStyles.detailsColumn}>
        <Profile userProfile={userProfile} logout={logout} />
        {selectedSong ? (
          <SongDetails song={selectedSong} token={token} />
        ) : selectedPlaylist ? (
          <PlaylistDetails playlist={selectedPlaylist} />
        ) : null}
      </div>
      <div style={MainScreenStyles.contentColumn}>
        <Playlists 
          token={token} 
          onSongSelect={handleSongSelect} 
          onPlaylistSelect={handlePlaylistSelect}
          selectedPlaylistId={selectedPlaylist?.id}
        />
      </div>
      <NavigationBar />
    </div>
  );
}