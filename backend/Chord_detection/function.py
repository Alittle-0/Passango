from io import BytesIO
import soundfile as sf
import numpy as np
import time
from scipy import signal

from Chord_detection.chords import ChordRecognitionThread
from Chord_detection.key import AudioKeyRecognition
from Chord_detection.tempo import TempoRecognitionThread


class DeChordCLI:
    """
    DeChordCLI class handles the core logic of chord recognition, tempo detection,
    and key recognition, and prints the results to the command line.
    """
    def __init__(self):
        self.chords = []
        self.key = None
        self.audio_data = None

    def preprocess_audio(self, audio_data: BytesIO):
        """
        Process audio data from a BytesIO object using soundfile.
        
        Args:
            audio_data (BytesIO): In-memory audio file data.
            filename (str): Reference filename to determine input format.
        
        Returns:
            tuple: (numpy.ndarray, int) containing audio data and sample rate
        """
        try:
            # Reset buffer position
            audio_data.seek(0)
            
            # Read audio data using soundfile
            data, sample_rate = sf.read(audio_data)
            
            # Convert to stereo if mono
            if len(data.shape) == 1:
                data = np.column_stack((data, data))
                
            # Resample to 44100 Hz if necessary
            if sample_rate != 44100:
                n_samples = int(len(data) * 44100 / sample_rate)
                data = signal.resample(data, n_samples)
                sample_rate = 44100
            
            self.audio_data = (data, sample_rate)
            
        except Exception as e:
            print(f"Error during in-memory audio conversion: {e}")
            exit(1)

    def load_audio(self):
        """
        Loads an audio file, detects tempo and key, and processes chords with transposition.
        """
        #Load audio data
        data, sample_rate = self.audio_data
        print("Loading audio data")
        
        # Calculate duration in seconds
        duration = len(data) / sample_rate
        print(f"Audio duration: {self.format_time(duration)}")
        
        # Start tempo recognition
        print("\nStarting tempo recognition...")
        start_time = time.time()
        self.tempo_thread = TempoRecognitionThread(data, sample_rate)
        self.tempo_thread.result.connect(self.on_tempo_recognized)
        self.tempo_thread.start()
        self.tempo_thread.wait()
        tempo_time = time.time() - start_time
        print(f"Tempo recognition completed in {tempo_time:.2f} seconds")

        # Start key recognition
        print("\nStarting key recognition...")
        start_time = time.time()
        self.key_thread = AudioKeyRecognition(data, sample_rate)
        self.key_thread.key_detected.connect(self.on_key_recognized)
        self.key_thread.start()
        self.key_thread.wait()
        key_time = time.time() - start_time
        print(f"Key recognition completed in {key_time:.2f} seconds")

        # Start chord recognition
        print("\nStarting chord recognition...")
        start_time = time.time()
        self.chord_thread = ChordRecognitionThread(data, sample_rate)
        self.chord_thread.result.connect(self.on_chords_recognized)
        self.chord_thread.start()
        self.chord_thread.wait()
        chord_time = time.time() - start_time
        print(f"Chord recognition completed in {chord_time:.2f} seconds")
        
    def on_tempo_recognized(self, tempo):
        """
        Handles the result of key recognition.
        """
        self.tempo = tempo

    def on_key_recognized(self, key):
        """
        Handles the result of key recognition.
        """
        self.key = key

    def on_chords_recognized(self, chords):
        """
        Handles the result of chord recognition.
        """
        self.chords = chords

    def get_results(self):
        """
        Returns the recognized chords, tempo, and key as a dictionary.
        """
        print("\nProcessing results...")
        results = {
            "key": self.key,
            "tempo": float(self.tempo),
            "chords": [
                {
                    "start_time": self.format_time(start_time),
                    "end_time": self.format_time(end_time),
                    "chord": chord_label
                }
                for start_time, end_time, chord_label in (self.chords or [])
            ],
        }
        return results

    def format_time(self, s):
        """
        Formats a time value in seconds into a human-readable string.
        """
        seconds = (s) % 60
        minutes = (s / 60) % 60
        hours = (s / (60 * 60)) % 24
        if int(hours) > 0:
            return "%02d:%02d:%02d" % (hours, minutes, round(seconds))
        else:
            return "%02d:%02d" % (minutes, round(seconds))