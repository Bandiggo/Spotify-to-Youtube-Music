import React from 'react';
import { Box, Typography, LinearProgress, Paper, Chip } from '@mui/material';

interface ConversionProgressProps {
  progress: {
    total: number;
    processed: number;
    added: number;
    failed: number;
    completed?: boolean;
  };
}

const ConversionProgress: React.FC<ConversionProgressProps> = ({ progress }) => {
  const percentComplete = progress.total > 0 
    ? Math.round((progress.processed / progress.total) * 100) 
    : 0;
    
  return (
    <Paper sx={{ p: 3, my: 2, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Converting Playlist
        </Typography>
        <Chip 
          label={`${percentComplete}%`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={percentComplete} 
        sx={{ height: 10, borderRadius: 5, mb: 2 }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Processing track {progress.processed} of {progress.total}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {percentComplete}% complete
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Chip 
          label={`Added: ${progress.added}`} 
          color="success" 
          size="small"
          variant="outlined"
        />
        <Chip 
          label={`Failed: ${progress.failed}`} 
          color={progress.failed > 0 ? "error" : "default"} 
          size="small"
          variant="outlined"
        />
      </Box>
    </Paper>
  );
};

export default ConversionProgress;