# Define the notes for transposition
NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
def get_semitone_input():
        """
        Prompts the user to input the number of semitones for transposition.
        """
        while True:
            try:
                semitones = 0 #int(input("Enter the number of semitones to transpose the chords (e.g., +2 or -2): "))
                return semitones
            except ValueError:
                print("Invalid input. Please enter an integer value.")

def transpose_chord(chord, semitones):
    """
    Transposes a single chord by the given number of semitones.
    """
    for i, char in enumerate(chord):
        if char.isdigit() or char in ["m", "M", "b", "#"]:
            continue
        root = chord[:i + 1]
        chord_type = chord[i + 1:]
        break
    else:
        root = chord
        chord_type = ""
    # Normalize double sharps (##) and double flats (bb)
    
    if "##" in root:
        root = NOTES[(NOTES.index(root.replace("##", "")) + 2) % len(NOTES)]
    elif "bb" in root:
        root = NOTES[(NOTES.index(root.replace("bb", "")) - 2) % len(NOTES)]
    
    # Handle enharmonic equivalents
    try:
        root_index = NOTES.index(root)
        transposed_index = (root_index + semitones) % len(NOTES)
        transposed_root = NOTES[transposed_index]
        return transposed_root + chord_type
    except ValueError:
        return chord  # Return the original chord if transposition fails

def transpose_chords(chords, semitones):
    """
    Transposes a list of chords by the given number of semitones.
    """
    transposed_chords = []
    for start_time, end_time, chord_label in chords:
        transposed_chord = transpose_chord(chord_label, semitones)
        transposed_chords.append((start_time, end_time, transposed_chord))
    return transposed_chords