import React from 'react';
import { LoginStyles } from '../styles/LoginStyles';
import ProjectExplanation from './ProjectExplanation';

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || 'http://localhost:3000';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state'
];

export default function Login() {
  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${scopes.join('%20')}&show_dialog=true`;

  return (
    <div style={{...LoginStyles.container, padding: '20px', maxWidth: '100%'}}>
      <h1 style={{...LoginStyles.title, fontSize: 'clamp(24px, 5vw, 36px)'}}>GlobalTrackTrends</h1>
      <div style={LoginStyles.projectExplanation}>
        <ProjectExplanation />
      </div>
      <p style={{...LoginStyles.description, maxWidth: '600px', margin: '20px auto'}}>
        Explora las tendencias musicales globales con nuestra aplicación interactiva.
        Inicia sesión con Spotify para comenzar tu viaje musical.
      </p>
      <a href={loginUrl} style={{...LoginStyles.loginButton, maxWidth: '300px', width: '100%'}}>
        Iniciar sesión con Spotify
      </a>
    </div>
  );
}