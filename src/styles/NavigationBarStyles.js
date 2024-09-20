export const NavigationBarStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '20px',
      width: '250px',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    button: {
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      fontSize: '16px',
      fontWeight: 'bold',
      textAlign: 'left',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  };