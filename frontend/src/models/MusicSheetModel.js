class MusicSheetModel {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL;
    }

    async getAllMusicSheets(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters);
            const response = await fetch(`${this.baseUrl}/api/music-sheets?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch music sheets');
            return await response.json();
        } catch (error) {
            console.error('Error fetching music sheets:', error);
            throw error;
        }
    }

    async getMusicSheetById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/api/music-sheets/${id}`);
            if (!response.ok) throw new Error('Failed to fetch music sheet');
            return await response.json();
        } catch (error) {
            console.error('Error fetching music sheet:', error);
            throw error;
        }
    }

    async createMusicSheet(data) {
        try {
            const response = await fetch(`${this.baseUrl}/api/music-sheets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create music sheet');
            return await response.json();
        } catch (error) {
            console.error('Error creating music sheet:', error);
            throw error;
        }
    }

    async updateMusicSheet(id, data) {
        try {
            const response = await fetch(`${this.baseUrl}/api/music-sheets/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update music sheet');
            return await response.json();
        } catch (error) {
            console.error('Error updating music sheet:', error);
            throw error;
        }
    }

    async deleteMusicSheet(id) {
        try {
            const response = await fetch(`${this.baseUrl}/api/music-sheets/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete music sheet');
            return await response.json();
        } catch (error) {
            console.error('Error deleting music sheet:', error);
            throw error;
        }
    }
}

export default new MusicSheetModel(); 