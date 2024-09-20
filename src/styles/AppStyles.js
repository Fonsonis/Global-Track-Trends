import { cloudTheme } from '../colors/cloudTheme';

export const AppStyles = {
  app: {
    height: '100vh',
    width: '100vw',
    backgroundColor: cloudTheme.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoutButton: {
    backgroundColor: cloudTheme.accent,
    color: cloudTheme.white,
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '1rem',
    boxShadow: `0 2px 4px ${cloudTheme.shadow}`,
  },
};