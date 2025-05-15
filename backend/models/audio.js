import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema({
  audio: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  lyrics: {
    type: String,
    required: true
  },
  song: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  chords: [{
    start_time: String,
    end_time: String,
    chord: String
  }],
  tempo: {
    type: Number,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Audio = mongoose.model('Audio', audioSchema);
export default Audio;