from flask import request, jsonify
from Lyric_scraping.find_artist import find_artist_by_song
from Lyric_scraping.process import process_AZlyric
from Lyric_scraping.backup import backup_lyrics


def lyrics_routes(app):
    @app.route('/api/get-lyrics', methods=['POST'])
    def get_lyrics():
        try:
            data = request.get_json()
            song_title = data.get('song')

            if not song_title:
                return jsonify({'error': 'Song title is required'}), 400

            # Find the artist and song using the provided title
            artist, song = find_artist_by_song(song_title)
            if not artist or not song:
                return jsonify({'error': 'Artist or song not found'}), 404
            
            # Run the main function
            lyric = process_AZlyric(song_title, artist)
            
            # Check if the scrape was unsuccessful
            if lyric.startswith("Error") or lyric.startswith("Failed") or lyric == "No lyric found.":
                lyric = backup_lyrics(artist, song)

            # Check if the backup was unsuccessful
            if lyric.startswith("[Errno") or lyric == "Song not found":
                return jsonify({'error': 'Lyrics not found', lyric: str}), 404
            
            # Return the raw lyrics directly
            return jsonify({'lyrics': lyric, 'song': song, 'artist': artist}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500