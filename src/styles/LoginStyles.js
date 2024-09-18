export const LoginStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#007bff',
    marginBottom: '20px',
    textAlign: 'center',
  },
  description: {
    fontSize: '1.2rem',
    color: '#6c757d',
    marginBottom: '30px',
    textAlign: 'center',
    maxWidth: '600px',
  },
  loginButton: {
    backgroundColor: '#1DB954',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#1ed760',
    },
  },
};