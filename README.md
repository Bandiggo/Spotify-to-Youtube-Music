# Spotify to YouTube Music Converter
 A web application that allows you to easily convert your Spotify playlists to YouTube Music.
![chrome_zFH8dl6d44](https://github.com/user-attachments/assets/4197531f-35a3-4872-b930-63538dae40f7)

## Features

- Convert Spotify playlists to YouTube Music with a single click
- Support for both authenticated user playlists and public playlists via URL
- Real-time conversion progress tracking
- Diagnostic tools to verify API connections
- Modern, responsive UI with dark mode support

## Prerequisites

### General
- Git
- Web browser with JavaScript enabled

### Backend
- Python 3.8+
- Spotify Developer account and API credentials
- Google/YouTube account for authentication

### Frontend
- Node.js 16+ and npm (to run the React application)
- React, TypeScript, and TailwindCSS (included in dependencies)

## Installation

### Clone the repository
```bash
git clone https://github.com/bandiggo/spotify-to-youtube-music.git
cd spotify-to-youtube-music
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file by copying the example:
```bash
cp .env.example .env
```

5. Configure Spotify API credentials:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
   - Create a new application
   - Set the redirect URI to `http://localhost:5000/callback`
   - Add your Client ID and Client Secret to the `.env` file

6. Set up YouTube Music authentication:
   - Install ytmusicapi CLI with `pip install ytmusicapi`
   - Run `ytmusicapi browser` and follow the instructions to create a `browser.json` file
   - Move the generated `browser.json` file to the `backend` directory
   - Detailed information can be found in: [ytmusicapi](https://ytmusicapi.readthedocs.io/en/stable/setup/browser.html)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend Server

```bash
cd backend
# Activate virtual environment if not already active
python run.py
```

The backend will run on http://localhost:5000

### Start the Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will be available at http://localhost:3000

## Usage

1. Open http://localhost:3000 in your web browser
2. To convert a public playlist:
   - Paste the Spotify playlist URL in the input field
   - Click "Convert"
3. To convert your private playlists:
   - Navigate to the "Convert" page
   - Select a playlist from the list
   - Click "Convert to YouTube Music"
4. The application will show the conversion progress in real-time
5. Once conversion is complete, you can find the playlist in your YouTube Music account

## Troubleshooting

### Authentication Issues
- Make sure your Spotify API credentials are correct in the `.env` file
- For YouTube Music, ensure your `browser.json` file is correct and placed in the backend directory
- Use the "Advanced Settings" > "Diagnostics & Testing" tool to verify API connections

### Conversion Problems
- Check that both backend and frontend servers are running
- Ensure you're logged into YouTube Music in your browser
- If the browser.json authentication expires, regenerate it with `ytmusicapi browser`
