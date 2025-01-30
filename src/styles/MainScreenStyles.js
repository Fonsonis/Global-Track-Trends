export const MainScreenStyles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  leftColumn: {
    width: '250px',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  mainContent: {
    flex: 1,
    position: 'relative',
    overflowY: 'auto',
    transition: 'background-color 0.3s ease',
    padding: '20px',
    className: 'scroll-container'
  },
  rightColumn: {
    width: '350px',
    padding: '20px',
    overflowY: 'auto',
    transition: 'background-color 0.3s ease',
    className: 'scroll-container'
  },
  contentColumn: {
    padding: '20px',
    position: 'relative',
    zIndex: 1,
  },
  analyticsPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'white',
    fontSize: '18px',
  }
};