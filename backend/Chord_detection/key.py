from PyQt5.QtCore import QThread, pyqtSignal
import numpy as np
from madmom.audio.chroma import DeepChromaProcessor
from madmom.features.key import CNNKeyRecognitionProcessor, key_prediction_to_label
from madmom.audio.signal import Signal

class AudioKeyRecognition(QThread):
    """
    AudioKeyRecognition handles key detection for a given audio file using a background thread.
    """
    key_detected = pyqtSignal(str)  # Signal to return the recognized key

    def __init__(self, data, sample_rate):
        super().__init__()
        self.audio_data = data
        self.sample_rate = sample_rate

    def run(self):
        # Process and recognize the key using madmom
        try:
            audio_data = self.audio_data
                        
            # Get key prediction
            key_processor = CNNKeyRecognitionProcessor()
            key_prediction = key_processor(audio_data)
            
            # Convert prediction to human-readable key label
            key_label = key_prediction_to_label(key_prediction)
            
            # Emit the detected key
            self.key_detected.emit(key_label)
        except Exception as error:
            print(f"Key detection error: {error}")
            self.key_detected.emit("Error")
        finally:
            self.quit()