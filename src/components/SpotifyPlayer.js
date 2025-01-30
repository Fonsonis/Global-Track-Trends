import React, { useEffect } from 'react';

export default function SpotifyPlayer({ token, onPlayerReady }) {
  useEffect(() => {
    // Asegurarse de definir `onSpotifyWebPlaybackSDKReady` antes de cargar el script
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Spotify SDK está listo para inicializar.");
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5,
      });

      // Configuración de listeners del reproductor
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        onPlayerReady(player, device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message);
      });

      player.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate:', message);
      });

      player.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
      });

      // Conectar el reproductor
      player.connect().then(success => {
        if (success) {
          console.log('El SDK Web Playback se conectó exitosamente.');
        } else {
          console.error('No se pudo conectar el SDK Web Playback.');
        }
      });
    };

    // Cargar el script del SDK de Spotify
    const scriptId = 'spotify-player-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;

      script.onload = () => {
        console.log('Spotify Web Playback SDK cargado correctamente.');
        if (window.onSpotifyWebPlaybackSDKReady) {
          window.onSpotifyWebPlaybackSDKReady();
        }
      };

      script.onerror = () => {
        console.error('Error al cargar el SDK de Spotify.');
      };

      document.body.appendChild(script);
    } else if (window.Spotify) {
      // Si el script ya está cargado y Spotify está disponible
      window.onSpotifyWebPlaybackSDKReady();
    }

    // Limpieza al desmontar el componente
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [token, onPlayerReady]);

  return null;
}
