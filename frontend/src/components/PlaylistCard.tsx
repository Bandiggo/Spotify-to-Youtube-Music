import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, CardActions } from '@mui/material';

interface PlaylistProps {
  id: string;
  name: string;
  tracks: number;
  image?: string;
  onSelect: (id: string, name: string) => void;
}

const PlaylistCard: React.FC<PlaylistProps> = ({ id, name, tracks, image, onSelect }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      {image && (
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={name}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tracks} tracks
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onSelect(id, name)}>
          Select for conversion
        </Button>
      </CardActions>
    </Card>
  );
};

export default PlaylistCard;