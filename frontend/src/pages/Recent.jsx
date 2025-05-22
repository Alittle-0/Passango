import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Recent() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
        <div className="loadingstate_recent">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container_recent">
        <div className="errorstate_recent">
          <h2>Error: {error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container_recent">
 
      <main className="recentcontent_recent">
        <div className="headersection_recent">
          <h1>Recent Songs</h1>
          <button className="backbutton_recent" onClick={() => navigate("/profile")}>Back to Main</button> {/* ADDED: Button to navigate to main page */}
        </div>
        <div className="songsgrid_recent">
          {songs.map((song) => (
            <section key={song._id} className="songcard_recent" onClick={() => handleSongClick(song._id)}>
              <div className="songinfo_recent">
                <h3>{song.song}</h3>
                <p>{song.artist}</p>
              </div>
            </section>
          ))}
        </div>
      </main>

    </div>
  );
}

export default Recent;