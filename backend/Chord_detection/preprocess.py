from io import BytesIO
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QTimer
from Chord_detection.function import DeChordCLI
import sys

def process_audio(audio_data: BytesIO):
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
        dechord.preprocess_audio(audio_data)
        
        # Load and process the audio
        dechord.load_audio()
        
        # Use QTimer to delay result collection until processing is complete
        results = None
        def collect_results():
            nonlocal results
            results = dechord.get_results()  # Get results from DeChordCLI
            app.quit()

        # Schedule result collection
        QTimer.singleShot(1000, collect_results)
        
        # Run the Qt event loop
        app.exec_()
        
        if not results or not results.get('chords'):
            print("Warning: No chords detected in the audio")
        
        return results
    except Exception as e:
            return f"Audio processing failed: {str(e)}"
