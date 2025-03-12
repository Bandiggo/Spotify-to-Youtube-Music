import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Container, Typography } from '@mui/material';

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the convert page after a short delay
    const timer = setTimeout(() => {
      navigate('/convert');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container sx={{ textAlign: 'center', my: 5 }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Authentication successful. Redirecting...
      </Typography>
    </Container>
  );
};

export default CallbackPage;