from flask import Blueprint, request, jsonify, redirect, session, url_for, current_app
from app.services.spotify import SpotifyService
from app.services.youtube import YouTubeMusicService
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from datetime import datetime
from flask import Response, stream_with_context
import time
import json
from threading import Thread

bp = Blueprint('main', __name__)

spotify_service = None
ytmusic_service = None

@bp.record
def on_register(state):
    global spotify_service, ytmusic_service
    spotify_service = SpotifyService(state.app)
    ytmusic_service = YouTubeMusicService()

@bp.route('/login')
def login():
    """Generate Spotify login URL and redirect user"""
    auth_url = spotify_service.get_auth_url()
    return jsonify({'auth_url': auth_url})

@bp.route('/callback')
def callback():
    """Handle Spotify callback after authentication"""
    code = request.args.get('code')
    token_info = spotify_service.get_token(code)
    session['token_info'] = token_info
    return redirect('http://localhost:3000/callback')

@bp.route('/playlists')
def get_playlists():
    """Get user's Spotify playlists"""
    try:
        playlists = spotify_service.get_playlists()
        return jsonify(playlists)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/public-playlist/<playlist_id>')
def get_public_playlist(playlist_id):
    """Get a public playlist without authentication"""
    try:
        # Use the spotify_service object
        playlist = spotify_service.get_public_playlist(playlist_id)
        return jsonify(playlist)
    except Exception as e:
        print(f"Error fetching playlist {playlist_id}: {str(e)}")
        return jsonify({"error": f"Could not access playlist: {str(e)}"}), 400

@bp.route('/convert', methods=['POST'])
def convert_playlist():
    """Convert Spotify playlist to YouTube Music"""
    try:
        data = request.get_json()
        playlist_id = data.get('playlist_id')
        use_auth = data.get('use_auth', 'token_info' in session)
        
        # Get tracks from Spotify
        tracks = spotify_service.get_playlist_tracks(playlist_id, use_auth)
        
        # Create playlist on YouTube Music
        ytm_playlist_id = ytmusic_service.create_playlist(
            title=data.get('playlist_name', 'Imported from Spotify'),
            description=data.get('description', 'Converted from Spotify')
        )
        
        # Start tracks addition in a background thread
        thread = Thread(
            target=ytmusic_service.add_tracks_to_playlist, 
            args=(ytm_playlist_id, tracks)
        )
        thread.daemon = True
        thread.start()
        
        # Return immediately with playlist ID
        return jsonify({
            'status': 'processing',
            'message': 'Conversion started. Check progress for updates.',
            'spotify_tracks': len(tracks),
            'youtube_playlist_id': ytm_playlist_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
@bp.route('/diagnose')
def diagnose():
    """Diagnostic endpoint to check API connections"""
    result = {
        'spotify': {'status': 'unknown'},
        'youtube_music': {'status': 'unknown'}
    }
    
    # Test Spotify
    try:
        client_credentials_manager = SpotifyClientCredentials(
            client_id=spotify_service.client_id,
            client_secret=spotify_service.client_secret
        )
        sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
        categories = sp.categories(country='US', limit=1)
        
        if categories and 'categories' in categories:
            result['spotify'] = {
                'status': 'ok',
                'message': 'Successfully connected to Spotify API',
                'sample_data': f"Found {len(categories['categories']['items'])} categories"
            }
        else:
            result['spotify'] = {
                'status': 'error',
                'message': 'Connected but got unexpected response',
                'data': categories
            }
    except Exception as e:
        result['spotify'] = {
            'status': 'error',
            'message': f'Error connecting to Spotify: {str(e)}'
        }
    
    # Test YouTube Music
    try:
        playlists = ytmusic_service.get_library_playlists()
        result['youtube_music'] = {
            'status': 'ok',
            'message': 'Successfully connected to YouTube Music API',
            'sample_data': f"Found {len(playlists)} playlists" if playlists else "No playlists found"
        }
    except Exception as e:
        result['youtube_music'] = {
            'status': 'error',
            'message': f'Error connecting to YouTube Music: {str(e)}'
        }
        
    return jsonify(result)

@bp.route('/test-playlists')
def test_playlists():
    """Test multiple known public playlist IDs"""
    test_ids = [
        '37i9dQZF1DXcBWIGoYBM5M',  
        '37i9dQZEVXbMDoHDwVN2tF',   # Global Top 50
        '37i9dQZEVXbLRQDuF5jeBp',   # US Top 50
        '37i9dQZF1DX0XUsuxWHRQd',   # RapCaviar
        '37i9dQZF1DX4dyzvuaRJ0n'    # mint
    ]
    
    results = {}
    
    for playlist_id in test_ids:
        try:
            client_credentials_manager = SpotifyClientCredentials(
                client_id=spotify_service.client_id,
                client_secret=spotify_service.client_secret
            )
            sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
            playlist = sp.playlist(playlist_id, market="US")
            
            results[playlist_id] = {
                'status': 'ok',
                'name': playlist['name'],
                'tracks': playlist['tracks']['total'] if 'tracks' in playlist else 'unknown'
            }
        except Exception as e:
            results[playlist_id] = {
                'status': 'error',
                'message': str(e)
            }
    
    return jsonify(results)

@bp.route('/cors-test', methods=['GET', 'OPTIONS'])
def cors_test():
    """Test endpoint for CORS configuration"""
    return jsonify({
        'message': 'CORS is working correctly!',
        'timestamp': datetime.now().isoformat()
    })
    
@bp.route('/test-youtube')
def test_youtube():
    """Test YouTube Music authentication specifically"""
    try:
        # Test YouTube Music connection and returns playlists
        playlists = ytmusic_service.get_library_playlists()
        
        return jsonify({
            'status': 'success',
            'message': 'Successfully connected to YouTube Music',
            'playlists': len(playlists),
            'data': playlists[:5] 
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400
        
@bp.route('/convert-progress/<playlist_id>')
def get_conversion_progress(playlist_id):
    """Stream conversion progress as Server-Sent Events"""
    def generate():
        progress = getattr(ytmusic_service, 'conversion_progress', {}).get(playlist_id, {})
        last_sent = {'total': 0, 'processed': 0, 'added': 0, 'failed': 0}
        
        # Stream updates for up to 5 minutes
        start_time = time.time()
        while time.time() - start_time < 300:  # 5 minutes timeout
            current = getattr(ytmusic_service, 'conversion_progress', {}).get(playlist_id, {})
            
            # Send update if there's a change or every 3 seconds as heartbeat
            if (current != last_sent) or (time.time() % 3 < 0.1):
                data = {
                    'total': current.get('total', 0),
                    'processed': current.get('processed', 0),
                    'added': current.get('added', 0),
                    'failed': current.get('failed', 0),
                    'completed': current.get('completed', False),
                    'playlist_id': current.get('ytm_playlist_id', '')
                }
                last_sent = data.copy()
                
                yield f"data: {json.dumps(data)}\n\n"
                
                # If conversion is complete, end stream
                if data['completed']:
                    break
            
            time.sleep(0.5)
    
    return Response(stream_with_context(generate()), 
                   mimetype='text/event-stream',
                   headers={'Cache-Control': 'no-cache',
                           'X-Accel-Buffering': 'no',
                           'Access-Control-Allow-Origin': 'http://localhost:3000'})