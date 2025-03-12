from flask import Blueprint, request, jsonify, redirect, session, url_for
from app.services.spotify import SpotifyService
from app.services.youtube import YouTubeMusicService

bp = Blueprint('main', __name__)
spotify_service = SpotifyService()
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
    # In a real app, you'd store this token securely
    session['token_info'] = token_info
    return redirect(url_for('frontend_callback'))  # Redirect to frontend

@bp.route('/playlists')
def get_playlists():
    """Get user's Spotify playlists"""
    try:
        playlists = spotify_service.get_playlists()
        return jsonify(playlists)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/convert', methods=['POST'])
def convert_playlist():
    """Convert Spotify playlist to YouTube Music"""
    try:
        data = request.get_json()
        playlist_id = data.get('playlist_id')
        
        # Get tracks from Spotify
        tracks = spotify_service.get_playlist_tracks(playlist_id)
        
        # Create playlist on YouTube Music and add tracks
        ytm_playlist_id = ytmusic_service.create_playlist(
            title=data.get('playlist_name', 'Imported from Spotify'),
            description=data.get('description', 'Converted from Spotify')
        )
        
        results = ytmusic_service.add_tracks_to_playlist(ytm_playlist_id, tracks)
        
        return jsonify({
            'status': 'success',
            'spotify_tracks': len(tracks),
            'youtube_tracks_added': results['added'],
            'youtube_tracks_failed': results['failed'],
            'youtube_playlist_id': ytm_playlist_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400