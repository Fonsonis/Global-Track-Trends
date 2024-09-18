import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Profile from './components/Profile';
import { getTokenFromUrl } from './components/spotify';
import { AppStyles } from './styles/AppStyles';

function App() {
  const [token, setToken] = useState('');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const tokenFromUrl = getTokenFromUrl();
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      window.location.hash = ''; // Limpia la URL
    }
  }, []);

  const logout = () => {
    setToken('');
    setUserProfile(null);
    
    // Limpia el almacenamiento local
    window.localStorage.removeItem('token');
    for (let key in window.localStorage) {
      if (key.startsWith('spotify')) {
        window.localStorage.removeItem(key);
      }
    }

    // Limpia las cookies
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Redirige a la página de inicio de la aplicación
    window.location.href = window.location.origin;
  };

  return (
    <div className="App" style={AppStyles.app}>
      {!token ? (
        <Login />
      ) : (
        <Profile token={token} setUserProfile={setUserProfile} userProfile={userProfile} logout={logout} />
      )}
    </div>
  );
}

export default App;