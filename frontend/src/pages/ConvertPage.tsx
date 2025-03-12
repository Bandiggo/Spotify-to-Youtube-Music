import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import api, { spotifyApi } from "../services/api";
import PlaylistCard from "../components/PlaylistCard";
import ConversionProgress from "../components/ConversionProgress";

interface Playlist {
  id: string;
  name: string;
  tracks: number;
  image?: string;
}

interface ConversionProgressData {
  total: number;
  processed: number;
  added: number;
  failed: number;
  completed: boolean;
  playlist_id: string;
}

const ConvertPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<any>(null);
  const [progressData, setProgressData] = useState<ConversionProgressData | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [ytPlaylistId, setYtPlaylistId] = useState<string | null>(null);
  const eventSource = useRef<EventSource | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const playlistId = params.get("playlist");
  
    if (playlistId) {
      fetchPublicPlaylist(playlistId);
    } else {
      fetchUserPlaylists();
    }
  
    // Cleanup function
    return () => {
      if (eventSource.current) {
        eventSource.current.close();
      }
    };
  }, [location]);

  const fetchUserPlaylists = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await spotifyApi.getPlaylists();
      setPlaylists(response.data);
    } catch (error: any) {
      console.error("Error fetching playlists:", error);
      setError(
        error.response?.data?.error ||
          "Failed to fetch playlists. Please login first."
      );
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPublicPlaylist = async (playlistId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Fetching playlist with ID: ${playlistId}`);

      const response = await spotifyApi.getPublicPlaylist(playlistId);
      console.log("Full API Response:", response);

      if (!response.data) {
        setError("Empty response received from server");
        setPlaylists([]);
        return;
      }

      if (response.data.error) {
        setError(response.data.error);
        setPlaylists([]);
        return;
      }

      // Valid playlist response
      setPlaylists([response.data]);
      setSelectedPlaylist(response.data);
    } catch (error: any) {
      console.error("Error fetching public playlist:", error);

      // Enhanced error reporting
      if (error.response) {
        // Server responded with error
        setError(
          `Server error: ${error.response.status} - ${
            error.response.data?.error || "Unknown error"
          }`
        );
      } else if (error.request) {
        // No response from server
        setError(
          "No response received from server. Please verify both frontend and backend are running."
        );
      } else {
        // Something else went wrong
        setError("Failed to fetch the playlist: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlaylist = (id: string, name: string) => {
    const playlist = playlists.find((p) => p.id === id);
    if (playlist) {
      setSelectedPlaylist(playlist);
    }
  };

  const handleConvert = async () => {
    if (!selectedPlaylist) return;
  
    setIsLoading(true);
    setError(null);
    setIsConverting(true);
    
    try {
      // Start the conversion process
      const response = await spotifyApi.convertPlaylist(
        selectedPlaylist.id,
        selectedPlaylist.name,
        `Converted from Spotify playlist: ${selectedPlaylist.name}`
      );
  
      // Store the YouTube Music playlist ID
      const ytmPlaylistId = response.data.youtube_playlist_id;
      setYtPlaylistId(ytmPlaylistId);
      
      // Connect to SSE endpoint for progress updates
      if (eventSource.current) {
        eventSource.current.close();
      }
      
      const newEventSource = new EventSource(`http://localhost:5000/convert-progress/${ytmPlaylistId}`);
      eventSource.current = newEventSource;
      
      newEventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setProgressData(data);
        
        if (data.completed) {
          newEventSource.close();
          setIsConverting(false);
          setConversionResult({
            status: 'success',
            spotify_tracks: data.total,
            youtube_tracks_added: data.added,
            youtube_tracks_failed: data.failed,
            youtube_playlist_id: data.playlist_id
          });
        }
      };
      
      newEventSource.onerror = () => {
        newEventSource.close();
        setIsConverting(false);
        setError("Error receiving conversion progress updates");
      };
      
      setIsLoading(false);
    } catch (error: any) {
      console.error("Conversion error:", error);
      setError(
        error.response?.data?.error || "Conversion failed. Please try again."
      );
      setIsLoading(false);
      setIsConverting(false);
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ textAlign: "center", my: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {selectedPlaylist ? "Starting conversion..." : "Loading playlists..."}
        </Typography>
      </Container>
    );
  }
  
  if (isConverting && progressData) {
    return (
      <Container sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Converting Playlist
        </Typography>
        <ConversionProgress progress={progressData} />
      </Container>
    );
  }

  if (conversionResult) {
    return (
      <Container sx={{ my: 4 }}>
        <Alert severity="success">
          <Typography variant="h6">Conversion completed!</Typography>
          <Typography>
            Successfully added {conversionResult.youtube_tracks_added} out of{" "}
            {conversionResult.spotify_tracks} tracks.
          </Typography>
          {conversionResult.youtube_tracks_failed > 0 && (
            <Typography>
              Failed to add {conversionResult.youtube_tracks_failed} tracks.
            </Typography>
          )}
        </Alert>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Convert Playlist
      </Typography>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ my: 3 }}>
        {selectedPlaylist ? (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Selected: <strong>{selectedPlaylist.name}</strong> (
              {selectedPlaylist.tracks} tracks)
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConvert}
              disabled={isLoading}
            >
              Convert to YouTube Music
            </Button>
          </Box>
        ) : (
          <Typography>Select a playlist to convert</Typography>
        )}
      </Box>

      <Grid container spacing={2}>
        {playlists.map((playlist) => (
          <Grid item xs={12} sm={6} md={4} key={playlist.id}>
            <PlaylistCard
              id={playlist.id}
              name={playlist.name}
              tracks={playlist.tracks}
              image={playlist.image}
              onSelect={handleSelectPlaylist}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ConvertPage;
