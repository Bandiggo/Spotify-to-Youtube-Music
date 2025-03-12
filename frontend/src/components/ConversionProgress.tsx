import React from 'react';
import { Card, CardBody, Progress, Chip } from '@heroui/react';

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
    <Card className="max-w-2xl mx-auto">
      <CardBody className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Converting Playlist</h2>
          <Chip 
            color="primary" 
            className="text-md"
          >
            {percentComplete}%
          </Chip>
        </div>
        
        <Progress 
          value={percentComplete} 
          color="primary"
          className="h-3 rounded-full mb-4"
          aria-label="Conversion progress"
        />
        
        <div className="flex justify-between mb-3">
          <p className="text-sm text-default-500">
            Processing track {progress.processed} of {progress.total}
          </p>
          <p className="text-sm font-semibold">
            {percentComplete}% complete
          </p>
        </div>
        
        <div className="flex gap-3">
          <Chip color="success" variant="flat">Added: {progress.added}</Chip>
          <Chip 
            color={progress.failed > 0 ? "danger" : "default"} 
            variant="flat"
          >
            Failed: {progress.failed}
          </Chip>
        </div>
      </CardBody>
    </Card>
  );
};

export default ConversionProgress;