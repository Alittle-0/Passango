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
    console.log("Selected file:", selectedFile); // Debug selected file
    const validTypes = ["audio/wav", "audio/mp3", "audio/mpeg"];
    if (selectedFile && validTypes.includes(selectedFile.type)) {
      console.log("File type:", selectedFile.type);
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid MP3 or WAV file");
    }
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
      console.log("Dropped file MIME type:", droppedFile.type);
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
    setIsLoading(true);

    if (!file || !(file.type === "audio/mpeg" || file.type === "audio/wav")) {
      setError("Please upload a valid MP3 or WAV file");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("audio", file, file.name);
      formData.append("song", song);
      
      const response = await fetch(
        "http://localhost:3000/api/audio/upload-audio",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Upload successful:", data);
        // Navigate to Template.jsx and pass the response data
        navigate("/template", { state: data });
      } else {
        console.error("Upload failed:", data);
        setError(data.message || "Failed to upload audio");
      }
    } catch (error) {
      setError("Error connecting to the server");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
                    name="audio"
                    type="file"
                    id="audio-upload"
                    accept="audio/mp3,audio/wav,audio/mpeg"
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
