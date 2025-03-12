import json
import os
import subprocess
from ytmusicapi import YTMusic, OAuthCredentials

def setup_ytmusic():
    """
    Set up the YouTube Music authentication using OAuth.
    This will create an oauth.json file in the current directory.
    """
    print("Setting up YouTube Music Authentication...")
    print("\n1. You need Google Cloud OAuth credentials for the YouTube Data API")
    print("2. Go to https://developers.google.com/youtube/v3/getting-started")
    print("3. Create a project and enable the YouTube Data API")
    print("4. Create OAuth credentials (select 'TVs and Limited Input devices')\n")
    
    client_id = input("Enter your Google Cloud OAuth client_id: ")
    client_secret = input("Enter your Google Cloud OAuth client_secret: ")
    
    # Store credentials temporarily for the OAuth flow
    credentials_file = "oauth_temp_credentials.json"
    with open(credentials_file, "w") as f:
        json.dump({"client_id": client_id, "client_secret": client_secret}, f)
    
    try:
        # Run the ytmusicapi oauth command
        print("\nRunning ytmusicapi OAuth flow. Follow the instructions in the terminal:")
        subprocess.run(["ytmusicapi", "oauth", "--credentials", credentials_file, "--file", "oauth.json"], check=True)
        print("\nAuthentication completed and saved to oauth.json")
        print("Make sure to update your YouTube Music service to use these credentials.")
    except Exception as e:
        print(f"\nError during OAuth setup: {str(e)}")
        print("\nAlternative manual setup:")
        print("1. Run 'ytmusicapi oauth' in your terminal")
        print("2. Follow the instructions to create oauth.json")
    finally:
        # Clean up temporary credentials file
        if os.path.exists(credentials_file):
            os.remove(credentials_file)

def format_duration(milliseconds):
    """Format duration from milliseconds to MM:SS format"""
    seconds = int(milliseconds / 1000)
    minutes = seconds // 60
    seconds = seconds % 60
    return f"{minutes}:{seconds:02d}"