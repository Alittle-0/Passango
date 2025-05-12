from io import BytesIO
from pydub import AudioSegment
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
        self.audio_data = None

    def preprocess_audio(self, audio_data: BytesIO, filename: str):
        """
        Process audio data from a BytesIO object in-memory and convert to WAV format if necessary.
        
        Args:
            audio_data (BytesIO): In-memory audio file data.
            filename (str): Reference filename to determine input format.
        
        Returns:
            BytesIO: Processed audio data in WAV format.
        """
        try:
            # Load audio from BytesIO using pydub
            audio_data.seek(0)  # Reset buffer position
            file_extension = filename.rsplit(".", 1)[1].lower()
            audio = AudioSegment.from_file(audio_data, format=file_extension)
            
            # Convert to WAV format with 44.1 kHz sample rate and stereo
            audio = audio.set_frame_rate(44100).set_channels(2)
            
            # Export to BytesIO as WAV
            output_audio = BytesIO()
            audio.export(output_audio, format="wav")
            output_audio.seek(0)
            
            self.audio_data = output_audio
        except Exception as e:
            print(f"Error during in-memory audio conversion: {e}")
            exit(1)

    def load_audio(self, semitones):
        """
        Loads an audio file, detects tempo and key, and processes chords with transposition.
        """
        #Load audio data
        audio_data = self.audio_data
        print("Loading audio data")

    # Start tempo detection
        self.tempo_thread = TempoDetectionThread(audio_data)
        self.tempo_thread.result.connect(self.on_tempo_detected)
        self.tempo_thread.start()
        self.tempo_thread.wait()

    # Start key recognition
        self.key_thread = AudioKeyRecognition(audio_data)
        self.key_thread.key_detected.connect(self.on_key_recognized)
        self.key_thread.start()
        self.key_thread.wait()

    # Start chord recognition with the provided semitones
        self.chord_thread = ChordRecognitionThread(audio_data, transpose=semitones)
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