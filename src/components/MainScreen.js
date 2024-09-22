import React, { useState, useEffect, useCallback } from 'react';
import Profile from './Profile';
import Playlists from './Playlists';
import SongDetails from './SongDetails';
import PlaylistDetails from './PlaylistDetails';
import NavigationBar from './NavigationBar';
import SpotifyPlayer from './SpotifyPlayer';
import { MainScreenStyles } from '../styles/MainScreenStyles';
import axios from 'axios';

export default function MainScreen({ token, userProfile, isPremium, logout }) {
  const [selectedSong, setSelectedSong] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#121212');
  const [prevBackgroundColor, setPrevBackgroundColor] = useState('#121212');
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (selectedPlaylist && selectedPlaylist.color) {
      setPrevBackgroundColor(backgroundColor);
      setBackgroundColor(selectedPlaylist.color);
    } else {
      setPrevBackgroundColor(backgroundColor);
    }
  }, [selectedPlaylist]);

  const handleSongSelect = async (song, playlistId, songList) => {
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
  };

  const handlePlaylistSelect = (playlist) => {
    setSelectedPlaylist(playlist);
    setSelectedSong(null);
    setCurrentPlaylist([]);
    setCurrentSongIndex(0);
    setIsPlaying(false);
    setProgress(0);
  };

  const handlePlayerReady = useCallback((player, device_id) => {
    setPlayer(player);
    setDeviceId(device_id);
  }, []);

  const handleSongChange = (direction) => {
    if (currentPlaylist.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentSongIndex + 1) % currentPlaylist.length;
    } else {
      newIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    }

    const newSong = currentPlaylist[newIndex].track;
    handleSongSelect(newSong, selectedPlaylist.id, currentPlaylist);
  };

  const togglePlayPause = async () => {
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
  };

  const handleSeek = async (position) => {
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
  };

  const updateProgress = (newProgress) => {
    setProgress(newProgress);
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
        <Profile userProfile={userProfile} isPremium={isPremium} logout={logout} />
        {selectedSong ? (
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
      {isPremium && <SpotifyPlayer token={token} onPlayerReady={handlePlayerReady} />}
    </div>
  );
}