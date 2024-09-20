import React from 'react';
import { ProfileStyles } from '../styles/ProfileStyles';

export default function Profile({ userProfile, logout }) {
  if (!userProfile) {
    return <div style={ProfileStyles.loading}>Cargando perfil...</div>;
  }

  return (
    <div style={ProfileStyles.container}>
      {userProfile.images && userProfile.images.length > 0 ? (
        <img src={userProfile.images[0].url} alt="Foto de perfil" style={ProfileStyles.image} />
      ) : (
        <div style={ProfileStyles.imagePlaceholder}>No hay foto de perfil</div>
      )}
      <h2 style={ProfileStyles.name}>{userProfile.display_name}</h2>
      <p style={ProfileStyles.info}>Seguidores: {userProfile.followers.total}</p>
      <button onClick={logout} style={ProfileStyles.logoutButton}>Cerrar sesión</button>
    </div>
  );
}