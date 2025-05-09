from PyQt5.QtCore import QThread, pyqtSignal
import madmom

class AudioKeyRecognition(QThread):
    """
    AudioKeyRecognition handles key detection for a given audio file using a background thread.
    """
    key_detected = pyqtSignal(str)  # Signal to return the recognized key

    def __init__(self, file_path):
        super().__init__()
        self.file_path = file_path  # Path to the audio file

    def run(self):
        # Process and recognize the key using madmom
        try:
            recognition_processor = madmom.features.key.CNNKeyRecognitionProcessor()
            predicted_key = recognition_processor(self.file_path)
            key_label = madmom.features.key.key_prediction_to_label(predicted_key)
            self.key_detected.emit(key_label)
        except Exception as error:
            self.key_detected.emit("Error")
        self.quit()