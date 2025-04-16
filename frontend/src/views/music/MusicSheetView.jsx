import React, { useState, useEffect } from 'react';
import MusicSheetController from '../../controllers/MusicSheetController';

const MusicSheetView = () => {
    const [musicSheets, setMusicSheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        instrument: '',
        difficulty: '',
        genre: ''
    });

    useEffect(() => {
        loadMusicSheets();
    }, [filters]);

    const loadMusicSheets = async () => {
        try {
            setLoading(true);
            const data = await MusicSheetController.loadMusicSheets(filters);
            setMusicSheets(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="music-sheet-view">
            <div className="filters">
                <select name="instrument" value={filters.instrument} onChange={handleFilterChange}>
                    <option value="">All Instruments</option>
                    <option value="guitar">Guitar</option>
                    <option value="piano">Piano</option>
                    <option value="bass">Bass</option>
                </select>
                
                <select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}>
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
                
                <select name="genre" value={filters.genre} onChange={handleFilterChange}>
                    <option value="">All Genres</option>
                    <option value="rock">Rock</option>
                    <option value="pop">Pop</option>
                    <option value="jazz">Jazz</option>
                </select>
            </div>

            <div className="music-sheets-grid">
                {musicSheets.map(sheet => (
                    <div key={sheet._id} className="music-sheet-card">
                        <h3>{sheet.title}</h3>
                        <p>Artist: {sheet.artist}</p>
                        <p>Instrument: {sheet.instrument}</p>
                        <p>Difficulty: {sheet.difficulty}</p>
                        <div className="chords">
                            {sheet.chords.map((chord, index) => (
                                <span key={index} className="chord-tag">{chord}</span>
                            ))}
                        </div>
                        <pre className="tabs">
                            {MusicSheetController.formatTabs(sheet.tabs)}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MusicSheetView; 