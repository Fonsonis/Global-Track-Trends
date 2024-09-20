export const SongDetailsStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  fixedContent: {
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  songInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '20px',
  },
  textInfo: {
    flex: 1,
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  artistName: {
    fontSize: '18px',
    color: '#b3b3b3',
  },
  playerControls: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '10px',
    margin: '0 10px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  scrollableContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  lyricsContainer: {
    marginTop: '20px',
  },
  lyricsTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  lyricsWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '15px',
    borderRadius: '8px',
  },
  lyrics: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: '16px',
    lineHeight: '1.6',
  },
  loadingText: {
    fontSize: '16px',
  },
};