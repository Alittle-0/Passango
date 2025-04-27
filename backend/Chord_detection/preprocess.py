from io import BytesIO
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QTimer
from Chord_detection.function import DeChordCLI
from Chord_detection.transpose import get_semitone_input
import tempfile
import os
import sys

def process_audio(audio_data: BytesIO, filename: str = "temp_audio.wav"):
    """
    Process audio data from a BytesIO object.
    
    Args:
        audio_data (BytesIO): In-memory audio file data.
        filename (str): Temporary filename for processing (with appropriate extension).
    
    Returns:
        dict: Results from DeChord processing (chords, tempo, key).
    """
    # Create a QApplication instance
    app = QApplication(sys.argv)

    # Initialize DeChordCLI
    dechord = DeChordCLI()

    # Create a temporary file to store the audio data
    with tempfile.NamedTemporaryFile(suffix=f".{filename.rsplit('.', 1)[1]}", delete=False) as temp_file:
        temp_file.write(audio_data.read())
        temp_file_path = temp_file.name

    try:
        # Preprocess the audio (converts to WAV if needed)
        processed_file = dechord.preprocess_audio(temp_file_path)
        semitones = get_semitone_input()
        
        # Load and process the audio
        dechord.load_audio(processed_file, semitones)
        
        # Use QTimer to delay result collection until processing is complete
        results = None
        def collect_results():
            nonlocal results
            results = dechord.get_results()  # Get results from DeChordCLI
            app.quit()

        # Schedule result collection
        QTimer.singleShot(100, collect_results)
        
        # Run the Qt event loop
        app.exec_()
        
        return results

    finally:
        # Clean up temporary files
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        # Clean up processed file if it exists and is different from temp_file_path
        if processed_file != temp_file_path and os.path.exists(processed_file):
            os.unlink(processed_file)
