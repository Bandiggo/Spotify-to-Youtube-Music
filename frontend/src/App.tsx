import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ConvertPage from './pages/ConvertPage';
import CallbackPage from './pages/CallbackPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1db954', // Spotify green
    },
    secondary: {
      main: '#ff0000', // YouTube red
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/convert" element={<ConvertPage />} />
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;