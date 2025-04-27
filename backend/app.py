from flask import Flask, request, jsonify
from flask_cors import CORS
from Transcription_byPhiHung import main as scraping
import sys
from dotenv import load_dotenv, dotenv_values
import os

# Load environment variables
load_dotenv('./.env')


# Load configuration from .env file
config = dotenv_values('./.env')

app = Flask(__name__)
CORS(app)

@app.route('/api/get-lyrics', methods=['POST'])
def get_lyrics():
    try:
        data = request.get_json()
        song_title = data.get('song')

        if not song_title:
            return jsonify({'error': 'Song are required'}), 400

        # Temporarily redirect stdout to capture print statements
        original_stdout = sys.stdout
        from io import StringIO
        sys.stdout = StringIO()

        # Run the main function (modified to return the lyric instead of printing)
        artist, song, lyric = scraping.main(song_title)

        # Restore stdout
        sys.stdout = original_stdout

        #Check if no artist of song
        if artist == "":
            return jsonify({'error': 'artist not found'}), 500
        
        # Check if the scrape was successful
        if lyric.startswith("Error") or lyric.startswith("Failed") or lyric == "No lyric found.":
            return jsonify({'error': lyric}), 500

        # Return the raw lyrics directly
        return jsonify({'lyrics': lyric, 'song': song, 'artist': artist}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Read PORT from .env, default to 8000 if not found
    port = int(config.get('PYTHON_PORT', 8000))
    app.run(host='0.0.0.0', port=port)