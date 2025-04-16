import MusicSheetModel from '../models/MusicSheetModel';

class MusicSheetController {
    constructor() {
        this.model = MusicSheetModel;
    }

    async loadMusicSheets(filters = {}) {
        try {
            const response = await this.model.getAllMusicSheets(filters);
            return response.data;
        } catch (error) {
            console.error('Error in MusicSheetController:', error);
            throw error;
        }
    }

    async loadMusicSheet(id) {
        try {
            const response = await this.model.getMusicSheetById(id);
            return response.data;
        } catch (error) {
            console.error('Error in MusicSheetController:', error);
            throw error;
        }
    }

    async createMusicSheet(data) {
        try {
            const response = await this.model.createMusicSheet(data);
            return response.data;
        } catch (error) {
            console.error('Error in MusicSheetController:', error);
            throw error;
        }
    }

    async updateMusicSheet(id, data) {
        try {
            const response = await this.model.updateMusicSheet(id, data);
            return response.data;
        } catch (error) {
            console.error('Error in MusicSheetController:', error);
            throw error;
        }
    }

    async deleteMusicSheet(id) {
        try {
            const response = await this.model.deleteMusicSheet(id);
            return response.data;
        } catch (error) {
            console.error('Error in MusicSheetController:', error);
            throw error;
        }
    }

    // Additional business logic methods
    formatTabs(tabs) {
        // Format tablature for display
        return tabs.split('\n').map(line => line.trim()).join('\n');
    }

    validateMusicSheet(data) {
        // Validate music sheet data
        const requiredFields = ['title', 'artist', 'instrument', 'chords'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        return true;
    }
}

export default new MusicSheetController(); 