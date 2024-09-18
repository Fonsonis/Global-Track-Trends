import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ProfileStyles } from '../styles/ProfileStyles';

function Profile({ token, setUserProfile, userProfile, logout }) {
  const [profileImage, setProfileImage] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [expandedTracks, setExpandedTracks] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProfile(data);
        if (data.images && data.images.length > 0) {
          setProfileImage(data.images[0].url);
        }
      } catch (error) {
        console.error('Error al obtener el perfil del usuario', error);
      }
    };

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

    if (!userProfile) {
      fetchUserProfile();
    } else if (userProfile.images && userProfile.images.length > 0) {
      setProfileImage(userProfile.images[0].url);
    }

    fetchPlaylists();
  }, [token, setUserProfile, userProfile]);

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

  if (!userProfile || playlists.length === 0) {
    return <div style={ProfileStyles.container}>Cargando perfil y listas de reproducción...</div>;
  }

  return (
    <div style={ProfileStyles.container}>
      <div style={ProfileStyles.profileCloud}>
        <h2 style={ProfileStyles.title}>Perfil de {userProfile.display_name}</h2>
        {profileImage ? (
          <img src={profileImage} alt="Foto de perfil" style={ProfileStyles.image} />
        ) : (
          <div style={ProfileStyles.imagePlaceholder}>No hay foto de perfil</div>
        )}
        <p style={ProfileStyles.info}>Seguidores: {userProfile.followers.total}</p>
        <p style={ProfileStyles.info}>ID: {userProfile.id}</p>
        <button onClick={logout} style={ProfileStyles.logoutButton}>Cerrar sesión</button>
      </div>
      <div style={ProfileStyles.mainContent}>
        {playlists.map((playlist) => (
          <div 
            key={playlist.id} 
            style={{
              ...ProfileStyles.playlistCloud,
              ...(selectedList === playlist.id ? ProfileStyles.expandedCloud : {})
            }}
            onClick={() => togglePlaylist(playlist.id)}
          >
            <h3 style={ProfileStyles.playlistTitle}>{playlist.name}</h3>
            {selectedList === playlist.id && (
              <div style={ProfileStyles.expandedInfo}>
                {playlist.images && playlist.images.length > 0 && (
                  <img src={playlist.images[0].url} alt={playlist.name} style={ProfileStyles.playlistImage} />
                )}
                <p style={ProfileStyles.playlistDescription}>{playlist.description}</p>
                {playlistTracks[playlist.id] && (
                  <div>
                    <h4 style={ProfileStyles.trackListTitle}>Canciones:</h4>
                    <ul style={ProfileStyles.trackList}>
                      {playlistTracks[playlist.id].slice(0, expandedTracks[playlist.id] ? 50 : 10).map((item, index) => (
                        <li key={item.track.id} style={ProfileStyles.trackItem}>
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
                        style={ProfileStyles.expandButton}
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
    </div>
  );
}

export default Profile;