import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
function Create() {
  const [song, setSong] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected file:", selectedFile); // Debug: Log the selected file
    setFile(selectedFile);
  };
    // Adding drag and drop functionality for file input
    const handleDragOver = (e) => {
      e.preventDefault(); // Prevent default behavior to allow drop
      e.currentTarget.classList.add('drag-over'); // Optional: Add visual feedback
    };
  
    // Handling file drop event
    const handleDrop = (e) => {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over'); // Optional: Remove visual feedback
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && (droppedFile.type === 'audio/mp3' || droppedFile.type === 'audio/wav')) {
        console.log("Dropped file:", droppedFile); // Debug: Log the dropped file
        setFile(droppedFile);
      } else {
        setError("Please drop a valid MP3 or WAV file");
      }
    };
  
    // Cleaning up drag-over class on drag leave
    const handleDragLeave = (e) => {
      e.preventDefault();
      e.currentTarget.classList.remove('drag-over'); // Optional: Remove visual feedback
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      console.log("Please select a file to upload");
      return;
    }

    console.log(file)
    const formData = new FormData();
    formData.append("audio", file);

    try {
      const chord_response = await fetch(
        "http://localhost:8000/api/get-chord",
        {
          method: "POST",
          body: formData,
        }
      );

      const lyric_response = await fetch(
        "http://localhost:8000/api/get-lyrics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ song }),
        }
      );

      const lyric_data = await lyric_response.json();
      const chord_data = await chord_response.json();

      if (lyric_response.ok && chord_response.ok) {
        navigate("/template", {
          state: {
            lyrics: lyric_data.lyrics,
            song: lyric_data.song,
            artist: lyric_data.artist,
            chords: chord_data.results.chords,
          },
        });
      } else {
        setError(
          lyric_data.error || chord_data.error || "Failed to fetch lyrics"
        );
      }
    } catch (error) {
      setError("Error connecting to the server");
      console.log(error);
    }
  };

  return (
    <section id="create">
      <Header />
        <main>
          <section className="create-section">
            <div className="upload-box">
              <h1>Find Lyrics</h1>
              <form onSubmit={handleSubmit}>
                <div className="song-input">
                  <label>Song: </label>
                  <input
                    type="text"
                    value={song}
                    onChange={(e) => setSong(e.target.value)}
                    required
                  />
                </div>
                <div className="file-input">
                  <label>Audio: </label>
                  <input
                    type="file"
                    id="audio-upload"
                    accept="audio/mp3,audio/wav"
                    onChange={handleFileChange}
                    aria-label="Upload audio file"
                    required
                    className={file?"file-input-change":""}
                  />
                  <label for="audio-upload">Select or drop an audio file</label>
                </div>
                
                <button type="submit" className="btn-upload">Upload</button>
              </form>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </section>
        </main>
        <Footer />
    </section>
  );
}

export default Create;
