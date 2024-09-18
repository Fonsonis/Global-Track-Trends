import React from 'react';
import { PlaylistDetailsStyles } from '../styles/PlaylistDetailsStyles';

function PlaylistDetails({ playlist }) {
  return (
    <div style={PlaylistDetailsStyles.container}>
      <h2 style={PlaylistDetailsStyles.title}>{playlist.name}</h2>
      {playlist.images && playlist.images.length > 0 && (
        <img src={playlist.images[0].url} alt={playlist.name} style={PlaylistDetailsStyles.image} />
      )}
      <p style={PlaylistDetailsStyles.description}>{playlist.description}</p>
      <p style={PlaylistDetailsStyles.info}>Creador: {playlist.owner.display_name}</p>
    </div>
  );
}

export default PlaylistDetails;