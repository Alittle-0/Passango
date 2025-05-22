import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# Set up Spotify API credentials
client_id = "09cb2c4bf3094df69ac74b64524ba4bf"
client_secret = "7e5f2148b2f1498ea64d0da77cb4a653"
client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

def find_artist_by_song(song_title: str) -> tuple[str, str]:
    # Search for the song
    results = sp.search(q=song_title, type="track", limit=1)
    tracks = results["tracks"]["items"]
    
    if tracks:
        # Extract artist information
        track = tracks[0]
        artist = track["artists"][0]["name"]
        song = track["name"]
        return (artist, song)
    else:
        return ("", "")
