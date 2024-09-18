export const PlaylistsStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  playlistCloud: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '10px',
    color: 'white',
    fontSize: '1.2em',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo por defecto (oscuro)
    cursor: 'pointer',
    transition: 'transform 0.3s, background-color 0.3s', // Transición suave del color
  },
  expandedCloud: {
    transform: 'scale(1.05)',
  },
  closedCloud: {
    transform: 'scale(1)',
  },
  playlistTitle: {
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  playlistDescription: {
    fontSize: '1em',
    opacity: 0.8,
  },
  playlistImageTopLeft: {
    position: 'absolute',
    top: '10px', // Arriba
    left: '10px', // Izquierda
    width: '80px', // Tamaño de la imagen
    height: '80px',
    objectFit: 'cover',
    borderRadius: '5px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Sombra para resaltar la imagen
  },
  playlistContent: {
    marginLeft: '100px', // Mover el contenido a la derecha para dejar espacio a la imagen
  },
  expandedInfo: {
    marginTop: '10px',
  },
  trackListTitle: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  trackList: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  trackItem: {
    margin: '5px 0',
  },
  expandButton: {
    marginTop: '10px',
    background: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};
