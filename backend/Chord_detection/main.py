import argparse
import os
import sys
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import QTimer
from function import DeChordCLI
from transpose import get_semitone_input

if __name__ == "__main__":
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="DeChord - Chord Recognition Tool")
    parser.add_argument("audio_file", help="Path to the audio file (e.g., C:/path/to/audio.wav)")
    args = parser.parse_args()

    # Validate the audio file path
    if not os.path.isfile(args.audio_file):
        print(f"Error: The file '{args.audio_file}' does not exist.")
        exit(1)

    # Create a QApplication instance
    app = QApplication(sys.argv)

    # Initialize and run the CLI application
    dechord = DeChordCLI()
    processed_file = dechord.preprocess_audio(args.audio_file)
    semitones = get_semitone_input()
    
    dechord.load_audio(processed_file, semitones)
    
    # Use QTimer to delay printing until threads are done and signals are processed
    def print_results():
        dechord.print_results()
        app.quit()  # Exit the application after printing

    # Schedule print_results to run after the event loop starts
    QTimer.singleShot(100, print_results)

    # Exit the application
    sys.exit(app.exec_())