class CollectionModel {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_URL;
    }

    async createCollection(data) {
        try {
            const response = await fetch(`${this.baseUrl}/api/collections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create collection');
            return await response.json();
        } catch (error) {
            console.error('Collection creation error:', error);
            throw error;
        }
    }

    async getCollections() {
        try {
            const response = await fetch(`${this.baseUrl}/api/collections`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch collections');
            return await response.json();
        } catch (error) {
            console.error('Collections fetch error:', error);
            throw error;
        }
    }

    async getCollectionById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/api/collections/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch collection');
            return await response.json();
        } catch (error) {
            console.error('Collection fetch error:', error);
            throw error;
        }
    }

    async addToCollection(collectionId, musicSheetId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/collections/${collectionId}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ musicSheetId })
            });
            if (!response.ok) throw new Error('Failed to add to collection');
            return await response.json();
        } catch (error) {
            console.error('Add to collection error:', error);
            throw error;
        }
    }

    async removeFromCollection(collectionId, musicSheetId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/collections/${collectionId}/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ musicSheetId })
            });
            if (!response.ok) throw new Error('Failed to remove from collection');
            return await response.json();
        } catch (error) {
            console.error('Remove from collection error:', error);
            throw error;
        }
    }

    async updateCollection(collectionId, data) {
        try {
            const response = await fetch(`${this.baseUrl}/api/collections/${collectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update collection');
            return await response.json();
        } catch (error) {
            console.error('Collection update error:', error);
            throw error;
        }
    }

    async deleteCollection(collectionId) {
        try {
            const response = await fetch(`${this.baseUrl}/api/collections/${collectionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete collection');
            return await response.json();
        } catch (error) {
            console.error('Collection deletion error:', error);
            throw error;
        }
    }
}

export default new CollectionModel(); 