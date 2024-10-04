export const LoginStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#121212', // Dark background color
    color: '#ffffff', // White text color
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    boxSizing: 'border-box',
  },
  content: {
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px',
    color: '#1DB954', // Spotify green
    fontWeight: 'bold',
  },
  description: {
    fontSize: '18px',
    marginBottom: '30px',
    color: '#b3b3b3', // Light gray for secondary text
    lineHeight: '1.5',
  },
  loginButton: {
    display: 'inline-block',
    padding: '15px 30px',
    fontSize: '18px',
    backgroundColor: '#1DB954', // Spotify green
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s, transform 0.3s',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  projectExplanation: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
};