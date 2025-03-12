import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ConvertPage from './pages/ConvertPage';
import CallbackPage from './pages/CallbackPage';
import CustomHeroUIProvider from './contexts/HeroUIProvider';
import './index.css';

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


const AppContent = () => {
  return (
    <CustomHeroUIProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white">
          <div className="fixed top-[10%] left-[5%] w-[20rem] h-[20rem] rounded-full bg-gradient-to-br from-emerald-600/15 to-transparent blur-3xl -z-10"></div>
          <div className="fixed bottom-[10%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-gradient-to-tr from-red-800/10 to-transparent blur-3xl -z-10"></div>
          
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/convert" element={<ConvertPage />} />
            <Route path="/callback" element={<CallbackPage />} />
          </Routes>
        </div>
      </ThemeProvider>
    </CustomHeroUIProvider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;