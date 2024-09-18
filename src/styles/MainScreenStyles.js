export const MainScreenStyles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f0f8ff',
    },
    profileSection: {
      flex: '0 0 20%',
      padding: '20px',
      borderRight: '1px solid #ccc',
    },
    playlistsSection: {
      flex: '0 0 50%',
      padding: '20px',
      borderRight: '1px solid #ccc',
      overflowY: 'auto',
    },
    detailsSection: {
      flex: '0 0 30%',
      padding: '20px',
      overflowY: 'auto',
    },
    emptyDetailsSection: {
      flex: '0 0 30%',
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#888',
    },
  };