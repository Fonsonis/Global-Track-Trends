export const SongDetailsStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: 'white',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    marginRight: '20px',
    borderRadius: '8px',
  },
  songInfo: {
    flex: 1,
  },
  title: {
    fontSize: '24px',
    marginBottom: '5px',
  },
  artistName: {
    fontSize: '18px',
    color: '#b3b3b3',
  },
  lyricsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
  },
  lyricsTitle: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  lyricsWrapper: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  },
  lyrics: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'white',
  },
};