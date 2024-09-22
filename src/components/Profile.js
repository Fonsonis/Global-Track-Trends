import React from 'react';
import { ProfileStyles } from '../styles/ProfileStyles';

export default function Profile({ userProfile, isPremium, logout }) {
  if (!userProfile) {
    return null;
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
      <p style={ProfileStyles.info}>Tipo de cuenta: {isPremium ? 'Premium' : 'Gratuita'}</p>
      <button onClick={logout} style={ProfileStyles.logoutButton}>Cerrar sesión</button>
    </div>
  );
}