import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import MainScreen from './components/MainScreen';
import SpotifyPlayer from './components/SpotifyPlayer';
import { getTokenFromUrl } from './utils/spotify';
import { AppStyles } from './styles/AppStyles';
import { GlobalStyles } from './styles/GlobalStyles';

export default function App() {
  const [token, setToken] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const tokenFromLocal = localStorage.getItem('token');
    const token = tokenFromLocal ?? getTokenFromUrl();
    if (token) {
      if(!tokenFromLocal)
      localStorage.setItem('token',token);
      setToken(token);
      window.location.hash = '';
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserProfile(null);
    window.localStorage.removeItem('token');
    localStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = window.location.origin;
  };

  return (
    <>
      <style>{GlobalStyles}</style>
      <div className="App" style={AppStyles.app}>
        {!token ? (
          <Login />
        ) : (
          <>
            <MainScreen token={token} userProfile={userProfile} logout={logout} />
            <SpotifyPlayer token={token} />
          </>
        )}
      </div>
    </>
  );
}