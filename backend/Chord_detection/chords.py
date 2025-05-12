from PyQt5.QtCore import QThread, pyqtSignal
from madmom.features.chords import CNNChordFeatureProcessor, CRFChordRecognitionProcessor
import numpy as np


class ChordRecognitionThread(QThread):
    result = pyqtSignal(list)

    def __init__(self, audio_data, sample_rate):
        super().__init__()
        self.audio_data = audio_data
        self.sample_rate = sample_rate

    def run(self):
        # Process chords using madmom
        chords = self._process_chords()

        # Format chords
        formatted_chords = self._format_chords(chords)

        # Emit the final result
        self.result.emit(formatted_chords)
        self.quit()

    def _process_chords(self):
        """
        Processes the audio file to recognize chords using madmom.
        """
        audio_data = self.audio_data
        # Convert audio data to proper format for madmom
        if len(audio_data.shape) > 1:
            # Convert stereo to mono by averaging channels
            audio_mono = np.mean(self.audio_data, axis=1)
        else:
            audio_mono = self.audio_data
            
        feat_processor = CNNChordFeatureProcessor()
        recog_processor = CRFChordRecognitionProcessor()
        feats = feat_processor(audio_mono)
        return recog_processor(feats)

    def _format_chords(self, chords):
        """
        Formats the chords without saving them to a cache file.
        """
        formatted_chords = []
        for start_time, end_time, chord_label in chords:
            chord_label = self._normalize_chord_label(chord_label)
            formatted_chords.append((start_time, end_time, chord_label))
        return formatted_chords

    def _normalize_chord_label(self, chord_label):
        """
        Normalizes the chord label by replacing specific suffixes.
        """
        replacements = {
            ":maj": "",
            ":min": "m",
            ":dim": "dim",
            ":aug": "aug",
            ":7": "7",
            ":maj7": "maj7",
            ":min7": "m7",
        }
        for key, value in replacements.items():
            if key in chord_label:
                chord_label = chord_label.replace(key, value)
        return chord_label