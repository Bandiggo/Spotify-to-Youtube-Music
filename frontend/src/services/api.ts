import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 600000
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`Error ${error.response.status} from ${error.config.url}:`, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export const spotifyApi = {
  login: () => api.get('/login'),
  getPlaylists: () => api.get('/playlists'),
  getPublicPlaylist: (playlistId: string) => api.get(`/public-playlist/${playlistId}`),
  getPlaylistTracks: (playlistId: string) => api.get(`/playlist-tracks/${playlistId}`),
  convertPlaylist: (playlistId: string, playlistName: string, description: string) => 
    api.post('/convert', { playlist_id: playlistId, playlist_name: playlistName, description }),
  diagnose: () => api.get('/diagnose'),
  testPlaylists: () => api.get('/test-playlists')
};

export default api;