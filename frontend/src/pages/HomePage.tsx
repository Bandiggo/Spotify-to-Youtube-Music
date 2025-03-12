import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { spotifyApi } from "../services/api";
import DiagnosticPanel from "../components/DiagnosticPanel";
import YouTubeMusicTester from "../components/YouTubeMusicTester";

const HomePage: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await spotifyApi.login();
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handlePublicPlaylist = async () => {
    if (!playlistUrl) return;

    setIsLoading(true);
    try {
      // Extract playlist ID from URL
      const playlistId = playlistUrl.split("/").pop()?.split("?")[0];

      if (playlistId) {
        navigate(`/convert?playlist=${playlistId}`);
      }
    } catch (error) {
      console.error("Error with playlist URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Spotify to YouTube Music
        </Typography>
        <Typography variant="h5" gutterBottom>
          Convert your Spotify playlists to YouTube Music
        </Typography>

        <Box sx={{ my: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleLogin}
            sx={{ mb: 3 }}
          >
            Login with Spotify
          </Button>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Or convert a public Spotify playlist
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <TextField
              label="Spotify Playlist URL"
              variant="outlined"
              fullWidth
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              sx={{ maxWidth: 500 }}
              placeholder="https://open.spotify.com/playlist/..."
            />
            <Button
              variant="contained"
              disabled={!playlistUrl || isLoading}
              onClick={handlePublicPlaylist}
            >
              Go
            </Button>
          </Box>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Diagnostics & Testing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DiagnosticPanel />
              <YouTubeMusicTester />
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
