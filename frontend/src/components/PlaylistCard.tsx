import React from 'react';
import { Card, CardBody, CardFooter, Button, Image } from '@heroui/react';

interface PlaylistProps {
  id: string;
  name: string;
  tracks: number;
  image?: string;
  onSelect: (id: string, name: string) => void;
}

const PlaylistCard: React.FC<PlaylistProps> = ({ id, name, tracks, image, onSelect }) => {
  return (
    <Card className="max-w-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-40 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-default-100 flex items-center justify-center">
            <span className="text-4xl">🎵</span>
          </div>
        )}
      </div>
      <CardBody>
        <h3 className="text-lg font-bold truncate">{name}</h3>
        <p className="text-default-500">{tracks} tracks</p>
      </CardBody>
      <CardFooter>
        <Button 
          color="primary" 
          onClick={() => onSelect(id, name)}
          className="w-full"
        >
          Select for conversion
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlaylistCard;