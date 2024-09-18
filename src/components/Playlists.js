import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PlaylistsStyles } from '../styles/PlaylistsStyles';

function Playlists({ token, onSongSelect, onPlaylistSelect }) {
  const [playlists, setPlaylists] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [selectedList, setSelectedList] = useState(null);
  const [expandedTracks, setExpandedTracks] = useState({});

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: 'Top 50',
            type: 'playlist',
            limit: 50
          }
        });

        const allPlaylists = response.data.playlists.items;
        const topGlobalPlaylist = allPlaylists.find(playlist => 
          playlist.name.includes('Top 50 - Global') && playlist.owner.id === 'spotify'
        );
        const topSpainPlaylist = allPlaylists.find(playlist => 
          playlist.name.includes('Top 50 - Spain') && playlist.owner.id === 'spotify'
        );

        if (topGlobalPlaylist && topSpainPlaylist) {
          setPlaylists([topGlobalPlaylist, topSpainPlaylist]);
        } else {
          console.error('No se encontraron las listas de reproducción esperadas');
        }
      } catch (error) {
        console.error('Error al obtener las listas de reproducción', error);
      }
    };

    fetchPlaylists();
  }, [token]);

  const togglePlaylist = async (playlistId) => {
    setSelectedList(prevSelected => prevSelected === playlistId ? null : playlistId);
    
    if (!playlistTracks[playlistId]) {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 50 }
        });
        setPlaylistTracks(prev => ({ ...prev, [playlistId]: response.data.items }));
      } catch (error) {
        console.error('Error al obtener las pistas de la lista de reproducción', error);
      }
    }
  };

  const toggleTrackExpansion = (playlistId) => {
    setExpandedTracks(prev => ({ ...prev, [playlistId]: !prev[playlistId] }));
  };

  const handleSongClick = (song, e) => {
    e.stopPropagation();
    onSongSelect(song);
  };

  const handlePlaylistClick = (playlist) => {
    onPlaylistSelect(playlist);
  };

  return (
    <div style={PlaylistsStyles.container}>
      {playlists.map((playlist) => (
        <div 
          key={playlist.id} 
          style={{
            ...PlaylistsStyles.playlistCloud,
            ...(selectedList === playlist.id ? PlaylistsStyles.expandedCloud : PlaylistsStyles.closedCloud)
          }}
          onClick={() => {
            togglePlaylist(playlist.id);
            handlePlaylistClick(playlist);
          }}
        >
          <h3 style={PlaylistsStyles.playlistTitle}>{playlist.name}</h3>
          {selectedList === playlist.id && (
            <div style={PlaylistsStyles.expandedInfo}>
              {playlist.images && playlist.images.length > 0 && (
                <img src={playlist.images[0].url} alt={playlist.name} style={PlaylistsStyles.playlistImage} />
              )}
              <p style={PlaylistsStyles.playlistDescription}>{playlist.description}</p>
              {playlistTracks[playlist.id] && (
                <div>
                  <h4 style={PlaylistsStyles.trackListTitle}>Canciones:</h4>
                  <ul style={PlaylistsStyles.trackList}>
                    {playlistTracks[playlist.id].slice(0, expandedTracks[playlist.id] ? 50 : 10).map((item, index) => (
                      <li 
                        key={item.track.id} 
                        style={{...PlaylistsStyles.trackItem, cursor: 'pointer'}}
                        onClick={(e) => handleSongClick(item.track, e)}
                      >
                        {index + 1}. {item.track.name} - {item.track.artists.map(artist => artist.name).join(', ')}
                      </li>
                    ))}
                  </ul>
                  {playlistTracks[playlist.id].length > 10 && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTrackExpansion(playlist.id);
                      }} 
                      style={PlaylistsStyles.expandButton}
                    >
                      {expandedTracks[playlist.id] ? 'Mostrar menos' : 'Mostrar más'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Playlists;