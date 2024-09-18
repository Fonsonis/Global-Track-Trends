import React from 'react';
import { ProfileStyles } from '../styles/ProfileStyles';

function Profile({ userProfile, logout }) {
  if (!userProfile) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div style={ProfileStyles.container}>
      <h2 style={ProfileStyles.title}>Perfil de {userProfile.display_name}</h2>
      {userProfile.images && userProfile.images.length > 0 ? (
        <img src={userProfile.images[0].url} alt="Foto de perfil" style={ProfileStyles.image} />
      ) : (
        <div style={ProfileStyles.imagePlaceholder}>No hay foto de perfil</div>
      )}
      <p style={ProfileStyles.info}>Seguidores: {userProfile.followers.total}</p>
      <p style={ProfileStyles.info}>ID: {userProfile.id}</p>
      <button onClick={logout} style={ProfileStyles.logoutButton}>Cerrar sesión</button>
    </div>
  );
}

export default Profile;