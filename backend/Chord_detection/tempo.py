import os
import hashlib
from PyQt5.QtCore import QThread, pyqtSignal
from madmom.features.beats import RNNBeatProcessor
from madmom.features.tempo import TempoEstimationProcessor
import numpy as np

class TempoRecognitionThread(QThread):
    result = pyqtSignal(int)

    def __init__(self, audio_data, sample_rate):
        super().__init__()
        self.audio_data = audio_data
        self.sample_rate = sample_rate

    def run(self):
        """
        Processes the audio file to recognize tempo using madmom.
        """
        try:
            audio_data = self.audio_data
            # Convert audio data to proper format for madmom
            if len(audio_data.shape) > 1:
                # Convert stereo to mono by averaging channels
                audio_mono = np.mean(self.audio_data, axis=1)
            else:
                audio_mono = self.audio_data
                
            beat_processor = RNNBeatProcessor()
            beats = beat_processor(audio_mono)
            tempo_processor = TempoEstimationProcessor(fps=200)
            tempos = tempo_processor(beats)
            
            if len(tempos):
                top_tempo = tempos[0][0]
                adjusted_tempo = self.adjust_tempo(top_tempo)
                self.result.emit(round(adjusted_tempo))
            else:
                self.result.emit(0)
        except Exception as e:
            print(f"Error in tempo detection: {str(e)}")
            self.result.emit(0)
        finally:
            self.quit()

    def adjust_tempo(self, tempo):
        """
        Adjusts tempo to be within 70-190 BPM range by doubling or halving.
        """
        while tempo < 70:
            tempo *= 2
        while tempo > 190:
            tempo /= 2
        return tempo
