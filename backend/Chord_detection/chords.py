from PyQt5.QtCore import QThread, pyqtSignal
import madmom
from Chord_detection.transpose import transpose_chords


class ChordRecognitionThread(QThread):
    result = pyqtSignal(list)

    def __init__(self, audio_path, transpose=0):
        super().__init__()
        self.audio_path = audio_path
        self.transpose = transpose  # Number of semitones to transpose

    def run(self):
        # Process chords using madmom
        chords = self._process_chords()

        # Format chords
        formatted_chords = self._format_chords(chords)

        # Apply transposition if needed
        if self.transpose != 0:
            formatted_chords = transpose_chords(formatted_chords, self.transpose)

        # Emit the final result
        self.result.emit(formatted_chords)
        self.quit()

    def _process_chords(self):
        """
        Processes the audio file to recognize chords using madmom.
        """
        feat_processor = madmom.features.chords.CNNChordFeatureProcessor()
        recog_processor = madmom.features.chords.CRFChordRecognitionProcessor()
        feats = feat_processor(self.audio_path)
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