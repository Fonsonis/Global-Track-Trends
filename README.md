# Spotify Top 50 Spain - React App

This project is a React application that displays the current Top 50 tracks in Spain from Spotify.

## Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed the latest version of [Node.js and npm](https://nodejs.org/)
* You have a Windows/Linux/Mac machine.
* You have read [Spotify's API documentation](https://developer.spotify.com/documentation/web-api/).

## Installing Spotify Top 50 Spain

To install Spotify Top 50 Spain, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/spotify-top-50.git
   ```
2. Navigate to the project directory:
   ```
   cd spotify-top-50
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Configuring the application

Before running the application, you need to set up your Spotify API credentials:

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and create a new application.
2. Once created, you'll see your `Client ID` and `Client Secret`.
3. Open the `src/spotifyService.js` file and replace the placeholders with your credentials:

   ```javascript
   const clientId = 'YOUR_CLIENT_ID';
   const clientSecret = 'YOUR_CLIENT_SECRET';
   ```

## Running Spotify Top 50 Spain

To run Spotify Top 50 Spain, follow these steps:

```
npm start
```

This will start the development server and open the application in your default web browser at `http://localhost:3000`.

## Contact

If you want to contact me you can reach me at `<your_email@example.com>`.

## License

This project uses the following license: [MIT License](<link_to_license>).
