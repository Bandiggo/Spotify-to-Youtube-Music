import React, { useState, useEffect } from "react";
import { 
  Button, 
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@heroui/react';
import { useNavigate } from "react-router-dom";
import DiagnosticPanel from "../components/DiagnosticPanel";
import YouTubeMusicTester from "../components/YouTubeMusicTester";

const HomePage: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Add global styles once when component mounts
  useEffect(() => {
    if (!document.getElementById('hover-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'hover-styles';
      styleElement.textContent = `
        .hovered .hovered-glow {
          opacity: 1 !important;
        }
        .hovered {
          transform: scale(1.05);
        }
        .hovered button {
          color: white !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.1) !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
    return () => {
      const styleElement = document.getElementById('hover-styles');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

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
    <main className="container mx-auto px-4 py-10 md:py-12 flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-green-300 text-transparent bg-clip-text">
          Spotify to YouTube Music
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Convert Spotify playlists to YouTube Music
        </p>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/10 to-green-300/5 rounded-3xl blur-md -z-10"></div>
        
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/15 to-green-400/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 -z-20"></div>
        
        <div className="absolute inset-0 bg-white/3 backdrop-blur-sm rounded-2xl border border-white/10 z-0 transition-all duration-300 group-hover:bg-white/4 group-hover:border-white/15"></div>
        
        <div className="absolute inset-0 mix-blend-overlay opacity-[0.02] 
          bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJhIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjc1IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIiByZXN1bHQ9Im5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMC4xMiAwIDAgMCAwIDAuOCAwIDAgMCAwIDAuNSAwIDAgMCAxIDAiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA3NSIvPjwvc3ZnPg==')] 
          rounded-2xl z-0"></div>
          
        <div className="absolute inset-0 mix-blend-soft-light opacity-[0.03] 
          bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')]
          rounded-2xl z-0"></div>

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/2 via-transparent to-white/2 rounded-2xl z-0"></div>
          
        <div className="grid md:grid-cols-5 gap-0 relative z-10 overflow-hidden rounded-2xl">
          <div className="hidden md:block md:col-span-2">
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="rounded-full bg-gradient-to-br from-black/10 to-black/5 p-6 mb-1 shadow-md border border-white/5">
              <div className="w-24 h-24 flex items-center justify-center">
                <span className="text-6xl bg-gradient-to-r from-emerald-600 to-green-500 text-transparent bg-clip-text drop-shadow-[0_0_12px_rgba(16,185,129,0.7)] mb-20">
                  🎵
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-medium text-white -mt-12 text-center">Playlist Converter</h3>
            <p className="text-gray-200 text-center -mt-0">
              Transfer your Spotify playlists to YouTube Music
            </p>
          </div>
        </div>
          
          <div className="md:col-span-3 p-8">
            <div className="flex flex-col justify-center h-full space-y-6">              
              <h3 className="text-xl font-medium text-white text-center">
                Enter a public Spotify playlist URL
              </h3>
              
              <div className="flex flex-col gap-5">
                <div className="relative">
                  <label className="block text-gray-300 mb-2 ml-1">Spotify Playlist URL</label>
                  
                  <div className="relative group/input">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-300/10 opacity-0 group-hover/input:opacity-100 rounded-xl blur-md transition-opacity duration-300 -z-20"></div>
                    
                    <div className="absolute inset-0 opacity-[0.03] 
                      bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')]
                      rounded-xl -z-5"></div>
                      
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-white/10 to-emerald-500/10 rounded-xl -z-10"></div>
                    
                    <input
                      type="text"
                      value={playlistUrl}
                      onChange={(e) => setPlaylistUrl(e.target.value)}
                      placeholder="https://open.spotify.com/playlist/..."
                      className="w-full h-16 px-4 py-4 text-white placeholder-gray-400 
                        bg-white/10 backdrop-blur-md rounded-xl border border-white/20
                        focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent
                        shadow-lg transition-all duration-300
                        group-hover/input:bg-white/15 group-hover/input:scale-[1.01] group-hover/input:shadow-emerald-500/20"
                    />
                  </div>
                </div>
                
                <Button
                  color="success"
                  isDisabled={!playlistUrl || isLoading}
                  onClick={handlePublicPlaylist}
                  isLoading={isLoading}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 border-0 py-3 text-white shadow-md w-full transition-transform duration-300 hover:scale-[1.01]"
                  radius="lg"
                  size="lg"
                >
                  Convert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Settings */}
      <div className="max-w-4xl mx-auto w-full flex justify-end pr-1">
        <div 
          className="relative" 
          onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
          onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-green-400/10 rounded-lg opacity-0 blur-md transition-opacity duration-300 -z-10 hovered-glow"></div>
          <div className="absolute inset-0 opacity-[0.03] 
            bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')]
            rounded-lg -z-5"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-white/5 to-emerald-500/5 rounded-lg -z-10"></div>
          <button 
            onClick={onOpen}
            className="px-4 py-2 text-gray-400 
              bg-white/5 backdrop-blur-sm rounded-lg border border-white/10
              hover:text-white hover:bg-white/10 
              transition-all duration-300
              shadow-sm"
          >
            Advanced Settings
          </button>
        </div>
      </div>

      {/* Diagnostics Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl" hideCloseButton>
        <ModalContent className="bg-gradient-to-br from-gray-900 to-black text-white border border-emerald-900/30 backdrop-blur-md shadow-xl">
          <ModalHeader className="border-b border-emerald-900/30">
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 text-transparent bg-clip-text">Diagnostics & Testing</h2>
          </ModalHeader>
          <ModalBody className="p-6">
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">System Diagnostics</h3>
              <DiagnosticPanel />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">YouTube Music Connection Test</h3>
              <YouTubeMusicTester />
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-emerald-900/30">
            <Button 
              color="default" 
              variant="light" 
              onPress={onClose}
              className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
};

export default HomePage;