from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

def create_app():
    app = Flask(__name__)
    
    CORS(app, 
         supports_credentials=True, 
         origins="http://localhost:3000",
         allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
         methods=["GET", "POST", "OPTIONS"])
    
    # Load environment variables
    load_dotenv()
    
    # Configure the app
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default-secret-key')
    app.config['SPOTIFY_CLIENT_ID'] = os.getenv('SPOTIFY_CLIENT_ID')
    app.config['SPOTIFY_CLIENT_SECRET'] = os.getenv('SPOTIFY_CLIENT_SECRET')
    app.config['SPOTIFY_REDIRECT_URI'] = os.getenv('SPOTIFY_REDIRECT_URI', 'http://localhost:5000/callback')
    
    # Register blueprints
    from app.routes import bp as main_bp
    app.register_blueprint(main_bp)
    
    return app