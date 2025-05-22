import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Recent() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/audio/songs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }

        const data = await response.json();
        setSongs(data);
      } catch (err) {
        console.error("Error fetching songs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);
  
  const handleSongClick = async (songId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/audio/songs/${songId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch song details");
      }

      const data = await response.json();
      navigate("/template", { state: data });
    } catch (err) {
      console.error("Error fetching song details:", err);
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="container_recent">
        <div className="loading-state">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container_recent">
        <div className="error-state">
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container_recent">
      {/*<Header />*/}
      <main className="recent-content">
        <h1>Recent Songs</h1>
        <div className="songs-grid">
          {songs.map((song) => (
            <div key={song._id} className="song-card" onClick={() => handleSongClick(song._id)}>
              <div className="song-info">
                <h3>{song.song}</h3>
                <p>{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/*<Footer />*/}
    </div>
  );
}

export default Recent;
