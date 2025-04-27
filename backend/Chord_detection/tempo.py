from PyQt5.QtCore import QThread, pyqtSignal
from madmom.features.beats import RNNBeatProcessor
from madmom.features.tempo import TempoEstimationProcessor


class TempoDetectionThread(QThread):
    """
    A QThread subclass for detecting the tempo of an audio file asynchronously.
    This thread processes an audio file to estimate its tempo using beat and tempo
    estimation processors. The result is emitted as a signal.
    Attributes:
        result (pyqtSignal): A signal emitted with the detected tempo as an integer.
    Methods:
        __init__(audio_file_path):
            Initializes the thread with the path to the audio file.
        run():
            Executes the tempo detection process.
        adjust_tempo(tempo):
            Adjusts the detected tempo to ensure it falls within a reasonable range
            (40 to 260 BPM).
    Parameters:
        audio_file_path (str): The path to the audio file for tempo detection.
    """
    result = pyqtSignal(int)

    def __init__(self, audio_file_path):
        super().__init__()
        self.audio_file_path = audio_file_path

    def run(self):
        # Process the audio file to detect tempo
        beat_processor = RNNBeatProcessor()
        beats = beat_processor(self.audio_file_path)
        tempo_processor = TempoEstimationProcessor(fps=200)
        tempos = tempo_processor(beats)

        if len(tempos):
            top_tempo = tempos[0][0]
            adjusted_tempo = self.adjust_tempo(top_tempo)
            self.result.emit(round(adjusted_tempo))
        else:
            self.result.emit(0)

        self.quit()

    def adjust_tempo(self, tempo):
        """
        Adjusts the detected tempo to ensure it falls within a reasonable range.
        """
        return tempo