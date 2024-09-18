import React from 'react';
import { LoginStyles } from '../styles/LoginStyles';
import ProjectExplanation from './ProjectExplanation';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:3000';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

function Login() {
  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&show_dialog=true`;

  return (
    <div style={LoginStyles.container}>
      <h1 style={LoginStyles.title}>Bienvenido a GlobalTrackTrends</h1>
      <ProjectExplanation />
      <p style={LoginStyles.description}>
        Explora las tendencias musicales globales con nuestra aplicación interactiva.
        Usa las flechas para descubrir más sobre GlobalTrackTrends.
      </p>
      <a href={loginUrl} style={LoginStyles.loginButton}>
        Iniciar sesión con Spotify
      </a>
    </div>
  );
}

export default Login;