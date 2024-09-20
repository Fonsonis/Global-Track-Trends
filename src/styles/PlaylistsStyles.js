export const PlaylistsStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  playlistCloud: {
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    },
  },
  selectedPlaylist: {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  collapsedPlaylist: {
    display: 'flex',
    alignItems: 'center',
  },
  expandedPlaylist: {
    width: '100%',
  },
  expandedHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
  },
  playlistImage: {
    width: '64px',
    height: '64px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '16px',
  },
  playlistImageSmall: {
    width: '48px',
    height: '48px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '16px',
  },
  playlistTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
  },
  playlistTitleExpanded: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
  },
  trackListContainer: {
    marginTop: '16px',
  },
  trackListTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: 'white',
  },
  trackList: {
    listStyleType: 'none',
    padding: 0,
  },
  trackItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  positionIndicator: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12px',
    fontSize: '14px',
  },
  medalIcon: {
    marginRight: '8px',
  },
  trackName: {
    flex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 'bold',
    color: 'white',
  },
  artistName: {
    marginLeft: '8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: 'white',
  },
  expandButton: {
    marginTop: '16px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '1px solid white',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};