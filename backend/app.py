from flask import Flask, request, jsonify
from flask_cors import CORS

from Lyric_scraping import main as scrape
from Chord_detection import preprocess as detectChord

from werkzeug.utils import secure_filename
from io import BytesIO

import sys
from dotenv import load_dotenv, dotenv_values

# Load environment variables
load_dotenv('./.env')


# Load configuration from .env file
config = dotenv_values('./.env')

app = Flask(__name__)
CORS(app)

# Allowed audio file extensions
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'm4a', 'ogg'}

# Audio file
def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/get-chord', methods=['POST'])
def upload_audio():
    try:
        # Check if a file is included in the request
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        file = request.files['audio']

        # Check if the file has a valid filename
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Validate file extension
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed types: mp3, wav, m4a, ogg'}), 400

        # Secure the filename
        filename = secure_filename(file.filename)

        # Read the file into memory
        audio_data = BytesIO(file.read())

        # Process the audio data using main.py
        try:
            results = detectChord.process_audio(audio_data, filename)
            return jsonify({
                'message': 'Audio processed successfully',
                'filename': filename,
                'size': len(audio_data.getvalue()),
                'results': results  # Include chord, tempo, key results
            }), 200
        except Exception as e:
            return jsonify({'error': f"Audio processing failed: {str(e)}"}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
        artist, song, lyric = scrape.main(song_title)
        

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