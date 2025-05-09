from io import BytesIO
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QTimer
from Chord_detection.function import DeChordCLI
from Chord_detection.transpose import get_semitone_input
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

    try:
        # Preprocess the audio (converts to WAV if needed)
        dechord.preprocess_audio(audio_data, filename)
        semitones = get_semitone_input()
        
        # Load and process the audio
        dechord.load_audio(semitones)
        
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
    except Exception as e:
            return f"Audio processing failed: {str(e)}"
