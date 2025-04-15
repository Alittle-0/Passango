class ChordDetectionModel {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL;
    }

    async detectChords(audioFile, options = {}) {
        try {
            const formData = new FormData();
            formData.append('audio', audioFile);
            formData.append('options', JSON.stringify(options));

            const response = await fetch(`${this.baseUrl}/api/chord-detection`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            if (!response.ok) throw new Error('Chord detection failed');
            return await response.json();
        } catch (error) {
            console.error('Chord detection error:', error);
            throw error;
        }
    }

    async convertToTabs(chords, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}/api/chord-to-tab`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ chords, ...options })
            });
            if (!response.ok) throw new Error('Tab conversion failed');
            return await response.json();
        } catch (error) {
            console.error('Tab conversion error:', error);
            throw error;
        }
    }

    async getChordLibrary() {
        try {
            const response = await fetch(`${this.baseUrl}/api/chords/library`);
            if (!response.ok) throw new Error('Failed to fetch chord library');
            return await response.json();
        } catch (error) {
            console.error('Chord library error:', error);
            throw error;
        }
    }

    async getChordVariations(chordName) {
        try {
            const response = await fetch(`${this.baseUrl}/api/chords/variations/${chordName}`);
            if (!response.ok) throw new Error('Failed to fetch chord variations');
            return await response.json();
        } catch (error) {
            console.error('Chord variations error:', error);
            throw error;
        }
    }
}

export default new ChordDetectionModel(); 