from flask import request, jsonify
from Chord_detection import preprocess
from werkzeug.utils import secure_filename
from io import BytesIO

# Allowed audio file extensions
ALLOWED_EXTENSIONS = {'mp3', 'wav'}

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def chord_routes(app):
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
                return jsonify({'error': 'Invalid file type. Allowed types: mp3, wav'}), 400

            # Secure the filename
            filename = secure_filename(file.filename)

            # Read the file into memory
            audio_data = BytesIO(file.read())

            # Process the audio data
            try:
                results = preprocess.process_audio(audio_data, filename)
                return jsonify({
                    'results': results  # Include chord, tempo, key results
                }), 200
            except Exception as e:
                return jsonify({'error': f"Audio processing failed: {str(e)}"}), 500

        except Exception as e:
            return jsonify({'error': str(e)}), 500