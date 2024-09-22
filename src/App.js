// App.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Login from './components/Login';
import MainScreen from './components/MainScreen';
import { AppStyles } from './styles/AppStyles';
import { GlobalStyles } from './styles/GlobalStyles';

export default function App() {
  const [token, setToken] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async (token) => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserProfile(response.data);
      setIsPremium(response.data.product === 'premium');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.response && error.response.status === 401) {
        // Token expirado, eliminar y redirigir al login
        localStorage.removeItem('spotify_token');
        setToken('');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        let parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});

    window.location.hash = '';
    let _token = hash.access_token;

    if (_token) {
      setToken(_token);
      localStorage.setItem('spotify_token', _token);
      fetchUserProfile(_token);
    } else {
      _token = localStorage.getItem('spotify_token');
      if (_token) {
        setToken(_token);
        fetchUserProfile(_token);
      } else {
        setIsLoading(false);
      }
    }
  }, [fetchUserProfile]);

  const logout = useCallback(() => {
    setToken('');
    setUserProfile(null);
    setIsPremium(false);
    localStorage.removeItem('spotify_token');
    window.location.href = window.location.origin;
  }, []);

  if (isLoading) {
    return <div style={AppStyles.loadingContainer}>Cargando perfil...</div>;
  }

  return (
    <>
      <style>{GlobalStyles}</style>
      <div className="App" style={AppStyles.app}>
        {!token ? (
          <Login />
        ) : (
          <MainScreen token={token} userProfile={userProfile} isPremium={isPremium} logout={logout} />
        )}
      </div>
    </>
  );
}