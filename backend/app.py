from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv, dotenv_values
from Chord_detection.chord_main import chord_routes
from Lyric_scraping.lyric_scaping_main import lyrics_routes

# Load environment variables
load_dotenv('./.env')
config = dotenv_values('./.env')

app = Flask(__name__)
CORS(app)

# Register routes from Chord_detection.preprocess and Lyric_scraping.main
chord_routes(app)
lyrics_routes(app)

if __name__ == '__main__':
    # Read PORT from .env, default to 8000 if not found
    port = int(config.get('PYTHON_PORT', 8000))
    app.run(host='0.0.0.0', port=port)