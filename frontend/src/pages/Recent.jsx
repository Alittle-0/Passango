import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Recent() {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/audio/songs`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch songs');
                }

                const data = await response.json();
                setSongs(data);
            } catch (err) {
                console.error('Error fetching songs:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    if (loading) {
        return (
            <div className="container_recent">
               
                <div className="loading-state">
                    <h2>Loading songs...</h2>
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
            
            <main className="recent-content">
                <h1>Recent Songs</h1>
                <div className="songs-grid">
                    {songs.map((song) => (
                        <div key={song._id} className="song-card">
                           
                            <div className="song-info">
                                <h3>{song.song}</h3>
                                <p>{song.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
           
        </div>
    );
}

export default Recent;