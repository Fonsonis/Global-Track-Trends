export const MainScreenStyles = {
  container: {
    display: 'flex',
    width: '100vw',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundTransition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: 'opacity 0.5s ease-in-out',
  },
  detailsColumn: {
    width: '400px', // Aumentamos el ancho de 300px a 350px
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
    overflowY: 'auto',
  },
  contentColumn: {
    flex: 1,
    padding: '20px',
    position: 'relative',
    overflowY: 'auto',
    zIndex: 1,
  },
  navigationBar: {
    width: '200px',
    padding: '20px',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
  },
};