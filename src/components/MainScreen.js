import React, { useState, useEffect, useCallback } from 'react';
import Profile from './Profile';
import Playlists from './Playlists';
import SongDetails from './SongDetails';
import PlaylistDetails from './PlaylistDetails';
import NavigationBar from './NavigationBar';
import SpotifyPlayer from './SpotifyPlayer';
import { MainScreenStyles } from '../styles/MainScreenStyles';

export default function MainScreen({ token, userProfile, logout }) {
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#121212');
  const [prevBackgroundColor, setPrevBackgroundColor] = useState('#121212');
  const [player, setPlayer] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  useEffect(() => {
    if (selectedPlaylist && selectedPlaylist.color) {
      setPrevBackgroundColor(backgroundColor);
      setBackgroundColor(selectedPlaylist.color);
    } else {
      setPrevBackgroundColor(backgroundColor);
      setBackgroundColor('#121212');
    }
  }, [selectedPlaylist]);

  const handleSongSelect = (song, playlistId, songList) => {
    setSelectedSong(song);
    setCurrentPlaylist(songList);
    setCurrentSongIndex(songList.findIndex(item => item.track.id === song.id));
  };

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
    setSelectedSong(null);
    setCurrentPlaylist([]);
    setCurrentSongIndex(0);
  };

  const handlePlayerReady = useCallback((player) => {
    setPlayer(player);
  }, []);

  const handleSongChange = (direction) => {
    if (currentPlaylist.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentSongIndex + 1) % currentPlaylist.length;
    } else {
      newIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    }

    setCurrentSongIndex(newIndex);
    setSelectedSong(currentPlaylist[newIndex].track);
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
          <SongDetails 
            song={selectedSong} 
            token={token} 
            player={player} 
            currentPlaylist={currentPlaylist}
            onSongChange={handleSongChange}
          />
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
      <SpotifyPlayer token={token} onPlayerReady={handlePlayerReady} />
    </div>
  );
}