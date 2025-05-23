const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const transposeChord = (chord, semitones) => {
  if (!chord) return chord;
  let root = "";
  let chordType = "";

  // Parse the chord to separate root and chord type
  for (let i = 1; i <= chord.length; i++) {
    const potentialRoot = chord.substring(0, i);
    if (NOTES.includes(potentialRoot)) {
      root = potentialRoot;
      chordType = chord.substring(i);
      break;
    }
  }
  if (!root) {
    root = chord;
    chordType = "";
  }

  try {
    // Normalize double sharps (##) and double flats (bb)
    let normalizedRoot = root;
    while (normalizedRoot.includes("##")) {
      const baseNote = normalizedRoot.replace("##", "");
      const baseIndex = NOTES.indexOf(baseNote);
      if (baseIndex !== -1) {
        normalizedRoot = NOTES[(baseIndex + 2) % NOTES.length];
      } else {
        break;
      }
    }
    while (normalizedRoot.includes("bb")) {
      const baseNote = normalizedRoot.replace("bb", "");
      const baseIndex = NOTES.indexOf(baseNote);
      if (baseIndex !== -1) {
        normalizedRoot = NOTES[(baseIndex - 2 + NOTES.length) % NOTES.length];
      } else {
        break;
      }
    }

    // Transpose the normalized root
    const rootIndex = NOTES.indexOf(normalizedRoot);
    if (rootIndex === -1) return chord;

    let transposedIndex = (rootIndex + semitones + NOTES.length) % NOTES.length;
    let transposedRoot = NOTES[transposedIndex];

    // Additional normalization for the transposed result
    while (transposedRoot.includes("##")) {
      const baseNote = transposedRoot.replace("##", "");
      const baseIndex = NOTES.indexOf(baseNote);
      if (baseIndex !== -1) {
        transposedRoot = NOTES[(baseIndex + 2) % NOTES.length];
      } else {
        break;
      }
    }
    while (transposedRoot.includes("bb")) {
      const baseNote = transposedRoot.replace("bb", "");
      const baseIndex = NOTES.indexOf(baseNote);
      if (baseIndex !== -1) {
        transposedRoot = NOTES[(baseIndex - 2 + NOTES.length) % NOTES.length];
      } else {
        break;
      }
    }

    return transposedRoot + chordType;
  } catch (error) {
    console.error("Transposition error:", error);
    return chord;
  }
};

export const transposeChords = (chords, semitones) => {
  if (!chords || !Array.isArray(chords)) return [];

  return chords.map((chord) => ({
    ...chord,
    chord: transposeChord(chord.chord, semitones),
  }));
};