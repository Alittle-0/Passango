import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../pages/Loading";

function Create() {
  const [song, setSong] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Selected file:", selectedFile);
    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type === "audio/mp3" || droppedFile.type === "audio/wav")
    ) {
      console.log("Dropped file:", droppedFile);
      setFile(droppedFile);
    } else {
      setError("Please drop a valid MP3 or WAV file");
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // Show loading component

    if (!file || !(file.type === "audio/mpeg" || file.type === "audio/wav")) {
      setError("Please upload a valid MP3 or WAV file");
      setIsLoading(false);
      return;
    }

    console.log(file);
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
            tempo: chord_data.results.tempo,
            key: chord_data.results.key,
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
    } finally {
      setIsLoading(false); // Hide loading component
    }
  };

  // Render Loading component if isLoading is true
  if (isLoading) {
    return <Loading />;
  }

  return (
    <section id="create">
      <Header />
      <main>
        <section className="create-section">
          <div className="upload-box">
            <h1>Find Lyrics</h1>
            <form onSubmit={handleSubmit}>
              <div className="song-input">
                <label>Song:</label>
                <input
                  type="text"
                  value={song}
                  onChange={(e) => setSong(e.target.value)}
                  required
                />
              </div>
              <div className="file-input">
                <label>Audio: </label>
                <div className="custom-file-wrapper">
                  <input
                    type="file"
                    id="audio-upload"
                    accept="audio/mp3,audio/wav"
                    onChange={handleFileChange}
                    required
                    className={file ? "file-input-change" : ""}
                  />
                  {file && (
                    <img
                      src="/public/images/paper-icon.png"
                      className="input-overlay-icon"
                    />
                  )}
                </div>
              </div>
              <label htmlFor="audio-upload" className="tips">
                {file ? file.name : "Select or drop an audio file"}
              </label>
              <button type="submit" className="btn-upload">
                Upload
              </button>
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