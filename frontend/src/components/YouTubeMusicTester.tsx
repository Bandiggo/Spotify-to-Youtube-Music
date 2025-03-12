import React, { useState } from 'react';
import { Button, Box, Typography, Alert, CircularProgress, Paper, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

interface YouTubePlaylist {
  title: string;
  playlistId: string;
  count?: number;
}

const YouTubeMusicTester: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{playlists?: YouTubePlaylist[], message?: string} | null>(null);

  const testYouTubeMusic = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.get('http://localhost:5000/test-youtube');
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect to YouTube Music');
      console.error('YouTube Music test error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>YouTube Music Authentication Test</Typography>
      
      <Button 
        variant="contained" 
        color="secondary"
        onClick={testYouTubeMusic}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> : null}
        Test YouTube Music Connection
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      
      {result && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="success">
            {result.message}
          </Alert>
          
          {result.playlists && result.playlists.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Your YouTube Music Playlists:
              </Typography>
              <List dense>
                {result.playlists?.map((playlist: YouTubePlaylist, index: number) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={playlist.title} 
                      secondary={`ID: ${playlist.playlistId}`} 
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default YouTubeMusicTester;