export const SongDetailsStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '20px',
    boxSizing: 'border-box',
  },
  fixedContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '20px',
    marginBottom: '20px',
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
    marginLeft: '15px'
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
  progressBarContainer: {
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '2px',
    marginBottom: '10px',
    cursor: 'pointer',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: '2px',
    transition: 'width 0.1s linear',
  },
  timeInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#b3b3b3',
    marginBottom: '10px',
    marginLeft: '2px',
    width: '99%',
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
  },
  lyricsSection: {
    flex: 1,
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
  premiumMessage: {
    textAlign: 'center',
    color: '#b3b3b3',
    marginTop: '20px',
  },
}