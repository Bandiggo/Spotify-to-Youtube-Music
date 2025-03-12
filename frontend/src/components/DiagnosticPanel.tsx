import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Chip, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

interface DiagnosticData {
  spotify: {
    status: string;
    message?: string;
    sample_data?: string;
  };
  youtube_music: {
    status: string;
    message?: string;
    sample_data?: string;
  };
}

interface TestPlaylistsData {
  [key: string]: {
    status: string;
    name?: string;
    tracks?: number;
    message?: string;
  };
}

const DiagnosticPanel: React.FC = () => {
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);
  const [testPlaylistsData, setTestPlaylistsData] = useState<TestPlaylistsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const diagnosticResponse = await axios.get('http://localhost:5000/diagnose');
      setDiagnosticData(diagnosticResponse.data);
      
      const testPlaylistsResponse = await axios.get('http://localhost:5000/test-playlists');
      setTestPlaylistsData(testPlaylistsResponse.data);
    } catch (err) {
      setError('Failed to run diagnostics. Is the backend server running?');
      console.error('Diagnostic error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, my: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>Diagnostics Tool</Typography>
      
      <Button 
        variant="outlined" 
        onClick={runDiagnostics} 
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} sx={{ mr: 1 }} /> : null}
        Run Diagnostics
      </Button>
      
      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}
      
      {diagnosticData && (
        <>
          <Typography variant="subtitle1" gutterBottom>API Status</Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Spotify API" 
                secondary={diagnosticData.spotify.message || 'No details available'} 
              />
              <Chip 
                label={diagnosticData.spotify.status} 
                color={diagnosticData.spotify.status === 'ok' ? 'success' : 'error'} 
                size="small" 
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="YouTube Music API" 
                secondary={diagnosticData.youtube_music.message || 'No details available'} 
              />
              <Chip 
                label={diagnosticData.youtube_music.status} 
                color={diagnosticData.youtube_music.status === 'ok' ? 'success' : 'error'} 
                size="small" 
              />
            </ListItem>
          </List>
        </>
      )}
      
      {testPlaylistsData && (
        <>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Test Playlists</Typography>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <List dense>
              {Object.entries(testPlaylistsData).map(([id, data]) => (
                <ListItem key={id}>
                  <ListItemText 
                    primary={data.name || id} 
                    secondary={
                      data.status === 'ok' 
                        ? `${data.tracks} tracks - Use this ID for testing!` 
                        : data.message || 'Error'
                    } 
                  />
                  <Chip 
                    label={data.status} 
                    color={data.status === 'ok' ? 'success' : 'error'} 
                    size="small" 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default DiagnosticPanel;