import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Lyric() {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/get-lyrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ song, artist }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/template', { state: { lyrics: data.lyrics, song: data.song, artist: data.artist } });
      } else {
        setError(data.error || 'Failed to fetch lyrics');
      }
    } catch (error) {
      setError('Error connecting to the server');
    }
  };

  return (
    <div>
      <h1>Find Lyrics</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Song: </label>
          <input
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Artist: </label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            required
          />
        </div>
        <button type="submit">Get Lyrics</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Lyric;