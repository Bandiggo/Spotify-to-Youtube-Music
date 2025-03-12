import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
from flask import current_app, session, url_for, request

class SpotifyService:
    def __init__(self, app=None):
        if app:
            self.init_app(app)
        
    def init_app(self, app):
        self.client_id = app.config['SPOTIFY_CLIENT_ID']
        self.client_secret = app.config['SPOTIFY_CLIENT_SECRET']
        self.redirect_uri = app.config['SPOTIFY_REDIRECT_URI']
        self.scope = 'playlist-read-private playlist-read-collaborative'
    
    def get_auth_url(self):
        """Generate the authorization URL for Spotify"""
        sp_oauth = SpotifyOAuth(
            client_id=self.client_id,
            client_secret=self.client_secret,
            redirect_uri=self.redirect_uri,
            scope=self.scope
        )
        auth_url = sp_oauth.get_authorize_url()
        return auth_url
    
    def get_token(self, code):
        """Exchange authorization code for access token"""
        sp_oauth = SpotifyOAuth(
            client_id=self.client_id,
            client_secret=self.client_secret,
            redirect_uri=self.redirect_uri,
            scope=self.scope
        )
        token_info = sp_oauth.get_access_token(code)
        return token_info
    
    def get_spotify_client(self, use_auth=True):
        """Get a Spotify client - either authenticated or for public access only"""
        if use_auth:
            token_info = session.get('token_info', None)
            if not token_info:
                raise Exception("No token available. Please login first.")
            return spotipy.Spotify(auth=token_info['access_token'])
        else:
            # Client credentials flow - only for public data
            client_credentials_manager = SpotifyClientCredentials(
                client_id=self.client_id,
                client_secret=self.client_secret
            )
            return spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    
    def get_playlists(self, use_auth=True):
        """Get user's playlists (requires auth) or a specific public playlist"""
        sp = self.get_spotify_client(use_auth)
        
        if use_auth:
            # Get authenticated user's playlists
            playlists = []
            results = sp.current_user_playlists()
            
            while results:
                for item in results['items']:
                    playlists.append({
                        'id': item['id'],
                        'name': item['name'],
                        'tracks': item['tracks']['total'],
                        'image': item['images'][0]['url'] if item['images'] else None
                    })
                
                if results['next']:
                    results = sp.next(results)
                else:
                    break
                    
            return playlists
        
        return {"message": "Please provide a playlist ID to fetch public playlists without auth"}
    
    def get_public_playlist(self, playlist_id):
        """Get a specific public playlist without authentication"""
        try:
            # Create a fresh client with client credentials flow specifically for this request
            client_credentials_manager = SpotifyClientCredentials(
                client_id=self.client_id,
                client_secret=self.client_secret
            )
            sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
            
            # Add market parameter which helps with region-restricted content
            playlist = sp.playlist(playlist_id, market="US")
            
            return {
                'id': playlist['id'],
                'name': playlist['name'],
                'tracks': playlist['tracks']['total'],
                'image': playlist['images'][0]['url'] if playlist['images'] else None
            }
        except Exception as e:
            print(f"Error fetching playlist {playlist_id}: {str(e)}")
            return {"error": f"Could not access playlist: {str(e)}"}
    
    def get_playlist_tracks(self, playlist_id, use_auth=True):
        """Get all tracks from a playlist"""
        try:
            # For playlist tracks, create a fresh client to avoid session issues
            if use_auth:
                token_info = session.get('token_info', None)
                if not token_info:
                    # Fall back to client credentials for public playlists
                    client_credentials_manager = SpotifyClientCredentials(
                        client_id=self.client_id,
                        client_secret=self.client_secret
                    )
                    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
                else:
                    sp = spotipy.Spotify(auth=token_info['access_token'])
            else:
                client_credentials_manager = SpotifyClientCredentials(
                    client_id=self.client_id,
                    client_secret=self.client_secret
                )
                sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
            
            # Try with market parameter
            tracks = []
            results = sp.playlist_tracks(playlist_id, market="US")
            
            while results:
                for item in results['items']:
                    track = item.get('track')
                    if track:
                        artist_names = [artist['name'] for artist in track['artists']]
                        tracks.append({
                            'name': track['name'],
                            'artists': artist_names,
                            'query': f"{track['name']} {' '.join(artist_names)}"
                        })
                
                if results.get('next'):
                    results = sp.next(results)
                else:
                    break
                    
            return tracks
        except Exception as e:
            print(f"Error getting tracks for playlist {playlist_id}: {str(e)}")
            return []