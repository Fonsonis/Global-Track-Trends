export const getTokenFromUrl = () => {
    const hash = window.location.hash;
    const token = hash
      .substring(1)
      .split('&')
      .find(elem => elem.startsWith('access_token'))
      ?.split('=')[1];
  
    return token;
  };