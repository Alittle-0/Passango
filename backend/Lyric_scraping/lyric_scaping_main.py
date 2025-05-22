from Lyric_scraping.scrape_lyric import Lyric
from Lyric_scraping.find import find_artist_by_song
from flask import request, jsonify

def main(song_title: str) -> tuple[str, str, str]:
    artist, song = find_artist_by_song(song_title)
    
    if artist and song:  # Only proceed if artist and song are non-empty
        service = Lyric(artist, song)
        lyric = service.scrape()
        return (artist, song, lyric)
    else:
        return ("", "", "")

def lyrics_routes(app):
    @app.route('/api/get-lyrics', methods=['POST'])
    def get_lyrics():
        try:
            data = request.get_json()
            song_title = data.get('song')

            if not song_title:
                return jsonify({'error': 'Song title is required'}), 400

            # Run the main function
            artist, song, lyric = main(song_title)
            
            # Check if no artist or song
            if not artist:
                return jsonify({'error': 'Artist not found'}), 404
            
            # Check if the scrape was successful
            if lyric.startswith("Error") or lyric.startswith("Failed") or lyric == "No lyric found.":
                return jsonify({'error': lyric}), 500

            # Return the raw lyrics directly
            return jsonify({'lyrics': lyric, 'song': song, 'artist': artist}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500