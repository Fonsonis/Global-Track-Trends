export const PlaylistsStyles = {
    container: {
      overflowY: 'auto',
      height: '100%',
    },
    playlistCloud: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '15px',
      marginBottom: '15px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
    },
    playlistTitle: {
      fontSize: '18px',
      marginBottom: '10px',
    },
    expandedInfo: {
      marginTop: '10px',
    },
    playlistImage: {
      width: '100px',
      height: '100px',
      objectFit: 'cover',
      marginBottom: '10px',
    },
    playlistDescription: {
      fontSize: '14px',
      marginBottom: '10px',
    },
    trackListTitle: {
      fontSize: '16px',
      marginBottom: '5px',
    },
    trackList: {
      listStyleType: 'none',
      padding: 0,
    },
    trackItem: {
      padding: '5px 0',
      fontSize: '14px',
    },
    expandButton: {
      marginTop: '10px',
      padding: '5px 10px',
      backgroundColor: '#1DB954',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    closedCloud: {
      height: '60px',
      overflow: 'hidden',
      transition: 'height 0.3s ease-in-out',
    },
    expandedCloud: {
      height: 'auto',
      transition: 'height 0.3s ease-in-out',
    },
  };