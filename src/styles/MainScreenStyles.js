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
    scrollbarWidth: 'none',  // Para Firefox
    msOverflowStyle: 'none',  // Para Internet Explorer y Edge
    '&::-webkit-scrollbar': {
      display: 'none',  // Para Chrome, Safari y Opera
    },
    '&:hover': {
      scrollbarWidth: 'thin',
      msOverflowStyle: 'auto',
      '&::-webkit-scrollbar': {
        display: 'block',
      },
    },
  },
  rightColumn: {
    width: '350px',
    padding: '20px',
    overflowY: 'auto',
    transition: 'background-color 0.3s ease',
    scrollbarWidth: 'none',  // Para Firefox
    msOverflowStyle: 'none',  // Para Internet Explorer y Edge
    '&::-webkit-scrollbar': {
      display: 'none',  // Para Chrome, Safari y Opera
    },
    '&:hover': {
      scrollbarWidth: 'thin',
      msOverflowStyle: 'auto',
      '&::-webkit-scrollbar': {
        display: 'block',
      },
    },
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
  },
  scrollbarStyles: {
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
  },
};