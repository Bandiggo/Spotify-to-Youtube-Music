from ytmusicapi import YTMusic
import os
import json

class YouTubeMusicService:
    def __init__(self):
        # Initialize progress tracking dictionary
        self.conversion_progress = {}
        
        try:
            # Try both authentication methods (browser.json or headers_auth.json)
            # in case the user has set up either one
            browser_auth_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'browser.json')
            
            if not os.path.exists(browser_auth_path):
                raise Exception("browser.json file not found. Run ytmusicapi browser auth first.")
            
            print(f"Initializing YouTube Music with auth file: {browser_auth_path}")
            
            # Use the full path to avoid path issues
            self.ytmusic = YTMusic(browser_auth_path)
            
            # Test connection to make sure it's working
            test = self.ytmusic.get_library_playlists(limit=1)
            print(f"YouTube Music connection successful. Found {len(test)} test playlists.")
                
        except Exception as e:
            print(f"Error initializing YouTube Music: {str(e)}")
            raise Exception(f"Failed to initialize YouTube Music: {str(e)}")
    
    def create_playlist(self, title, description="Imported from Spotify"):
        """Create a new playlist on YouTube Music"""
        try:
            print(f"Creating YouTube Music playlist: '{title}'")
            playlist_id = self.ytmusic.create_playlist(title, description)
            print(f"Successfully created playlist with ID: {playlist_id}")
            return playlist_id
        except Exception as e:
            print(f"Failed to create YouTube Music playlist: {str(e)}")
            raise Exception(f"Failed to create playlist: {str(e)}")
    
    def add_tracks_to_playlist(self, playlist_id, tracks):
        """
        Add tracks to an existing YouTube Music playlist
        Expects tracks to be a list of dicts with at least a 'query' key
        """
        added = 0
        failed = 0
        
        # Initialize progress tracking
        progress_id = playlist_id  # Use playlist_id as a key
        self.conversion_progress[progress_id] = {
            'total': len(tracks),
            'processed': 0,
            'added': 0,
            'failed': 0,
            'completed': False,
            'ytm_playlist_id': playlist_id
        }
        
        print(f"Adding {len(tracks)} tracks to YouTube Music playlist {playlist_id}")
        
        for i, track in enumerate(tracks):
            query = track.get('query')
            if not query:
                failed += 1
                self.conversion_progress[progress_id]['failed'] = failed
                self.conversion_progress[progress_id]['processed'] = i + 1
                continue
                
            try:
                # Log every 10 tracks to avoid excessive output
                if i % 10 == 0:
                    print(f"Processing track {i+1}/{len(tracks)}: {query}")
                
                # Search for the track
                search_results = self.ytmusic.search(query, filter='songs', limit=1)
                
                if search_results and len(search_results) > 0:
                    video_id = search_results[0]['videoId']
                    self.ytmusic.add_playlist_items(playlist_id, [video_id])
                    added += 1
                    self.conversion_progress[progress_id]['added'] = added
                else:
                    print(f"No results found for track: {query}")
                    failed += 1
                    self.conversion_progress[progress_id]['failed'] = failed
            except Exception as e:
                print(f"Failed to add track '{query}': {str(e)}")
                failed += 1
                self.conversion_progress[progress_id]['failed'] = failed
            
            # Update progress counter
            self.conversion_progress[progress_id]['processed'] = i + 1
        
        # Mark conversion as complete
        self.conversion_progress[progress_id]['completed'] = True
        
        print(f"Finished adding tracks. Added: {added}, Failed: {failed}")
        return {
            'added': added,
            'failed': failed
        }
    
    def get_library_playlists(self):
        """Get the user's YouTube Music playlists"""
        return self.ytmusic.get_library_playlists()