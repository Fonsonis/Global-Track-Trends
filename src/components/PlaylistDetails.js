import React from 'react';
import { PlaylistDetailsStyles } from '../styles/PlaylistDetailsStyles';

export default function PlaylistDetails({ playlist }) {
  return (
    <div style={PlaylistDetailsStyles.container}>
      <h2 style={PlaylistDetailsStyles.title}>{playlist.name}</h2>
      {playlist.images && playlist.images.length > 0 && (
        <img src={playlist.images[0].url} alt={playlist.name} style={PlaylistDetailsStyles.image} />
      )}
      <p style={PlaylistDetailsStyles.description}>{playlist.description}</p>
      <p style={PlaylistDetailsStyles.info}>Creator: {playlist.owner.display_name}</p>
      <p style={PlaylistDetailsStyles.info}>Tracks: {playlist.tracks?.total || 'N/A'}</p>
    </div>
  );
}