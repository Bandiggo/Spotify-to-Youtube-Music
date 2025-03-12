import React, { useState } from 'react';
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
    <div className="relative overflow-hidden">
      <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/10 to-green-300/5 rounded-xl blur-md -z-10"></div>
      
      <div className="absolute inset-0 bg-white/3 backdrop-blur-sm rounded-xl border border-white/10 z-0 transition-all duration-300 hover:bg-white/4 hover:border-white/15"></div>
      
      <div className="absolute inset-0 mix-blend-overlay opacity-[0.02] 
        bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48ZmlsdGVyIGlkPSJhIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjc1IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIiByZXN1bHQ9Im5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMC4xMiAwIDAgMCAwIDAuOCAwIDAgMCAwIDAuNSAwIDAgMCAxIDAiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIwLjA3NSIvPjwvc3ZnPg==')] 
        rounded-xl z-0"></div>
        
      <div className="absolute inset-0 mix-blend-soft-light opacity-[0.03] 
        bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')]
        rounded-xl z-0"></div>

      {/* Main content */}
      <div className="relative z-10 p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">YouTube Music Authentication Test</h3>
        
        <div className="mb-5">
          <div 
            className="relative inline-block" 
            onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-green-400/10 rounded-lg opacity-0 blur-md transition-opacity duration-300 -z-10 hovered-glow"></div>
            <div className="absolute inset-0 opacity-[0.03] 
              bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')]
              rounded-lg -z-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-white/5 to-emerald-500/5 rounded-lg -z-10"></div>
            <button 
              onClick={testYouTubeMusic}
              disabled={isLoading}
              className="px-4 py-2 text-gray-400 
                bg-white/5 backdrop-blur-sm rounded-lg border border-white/10
                hover:text-white hover:bg-white/10 
                transition-all duration-300
                shadow-sm flex items-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Test YouTube Music Connection
            </button>
          </div>
        </div>
        
        {error && (
          <div className="p-4 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <div className="p-4 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              {result.message}
            </div>
            
            {result.playlists && result.playlists.length > 0 && (
              <div className="mt-4">
                <h4 className="text-base font-medium text-white mb-3">Your YouTube Music Playlists</h4>
                <div className="rounded-lg overflow-hidden border border-white/10 backdrop-blur-sm">
                  <div className="max-h-64 overflow-y-auto">
                    {result.playlists.map((playlist, index) => (
                      <div key={index} className={`p-3 ${
                        index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'
                      }`}>
                        <p className="text-white font-medium">{playlist.title}</p>
                        <p className="text-sm text-gray-400">
                          {`ID: ${playlist.playlistId}`}
                          {playlist.count !== undefined && ` • ${playlist.count} tracks`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeMusicTester;