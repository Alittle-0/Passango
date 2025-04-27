import os
import subprocess
from Chord_detection.chords import ChordRecognitionThread
from Chord_detection.key import AudioKeyRecognition
from Chord_detection.tempo import TempoDetectionThread


class DeChordCLI:
    """
    DeChordCLI class handles the core logic of chord recognition, tempo detection,
    and key recognition, and prints the results to the command line.
    """
    def __init__(self):
        self.chords = []
        self.tempo = None
        self.key = None
        self.audio_file = None

    def preprocess_audio(self, file_path):
        """
        Ensures the audio file is in a supported format.
        Converts the file to WAV format with 44.1 kHz sample rate if necessary.
        """
        base_name = os.path.basename(file_path).rsplit(".", 1)[0]
        output_file = f"{base_name}_processed.wav"
        try:
            if file_path.endswith(".wav"):
                return file_path

            print(f"Converting {file_path} to WAV format...")
            subprocess.run(
                ["ffmpeg", "-i", file_path, "-ar", "44100", "-ac", "2", output_file],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                check=True
            )
            print(f"Converted file saved as {output_file}")
            return output_file
        except subprocess.CalledProcessError as e:
            print(f"Error during audio conversion: {e}")
            exit(1)

    def load_audio(self, file_name, semitones):
        """
        Loads an audio file, detects tempo and key, and processes chords with transposition.
    """
        self.audio_file = file_name
        print(f"Loading audio file: {file_name}")

    # Start tempo detection
        self.tempo_thread = TempoDetectionThread(file_name)
        self.tempo_thread.result.connect(self.on_tempo_detected)
        self.tempo_thread.start()
        self.tempo_thread.wait()

    # Start key recognition
        self.key_thread = AudioKeyRecognition(file_name)
        self.key_thread.key_detected.connect(self.on_key_recognized)
        self.key_thread.start()
        self.key_thread.wait()

    # Start chord recognition with the provided semitones
        self.chord_thread = ChordRecognitionThread(file_name, transpose=semitones)
        self.chord_thread.result.connect(self.on_chords_recognized)
        self.chord_thread.start()
        self.chord_thread.wait()
       
    def on_tempo_detected(self, tempo):
        """
        Handles the result of tempo detection.
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
        results = {
            "audio_file": self.audio_file,
            "tempo": self.tempo,
            "key": self.key,
            "chords": [
                {
                    "start_time": self.format_time(start_time),
                    "end_time": self.format_time(end_time),
                    "chord": chord_label
                }
                for start_time, end_time, chord_label in self.chords
            ] if self.chords else []
        }
        return results

    def print_results(self):
        """
        Prints the recognized chords, tempo, and key to the command line.
        """
        print(f"Audio File: {self.audio_file}")
        if self.tempo:
            print(f"Tempo: {self.tempo} BPM")
        if self.key:
            print(f"Key: {self.key}")
        if self.chords:
            print("Chords:")
            for start_time, end_time, chord_label in self.chords:
                print(f"({self.format_time(start_time)} - {self.format_time(end_time)}): {chord_label}")
        else:
            print("No chords detected.")

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