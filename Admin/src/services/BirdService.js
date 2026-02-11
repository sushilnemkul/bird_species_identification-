import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export const getBirds = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/birds`);
        return response.data;
    } catch (error) {
        console.error('Error fetching birds:', error);
        return [];
    }
};

export const createBird = async (birdData) => {
    try {
        const response = await axios.post(`${API_URL}/api/admin/birds`, birdData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to create bird');
    }
};

export const updateBird = async (id, birdData) => {
    try {
        const response = await axios.put(`${API_URL}/api/admin/birds/${id}`, birdData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update bird');
    }
};

export const deleteBird = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/admin/birds/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete bird');
    }
};

export const uploadAdminImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
        const response = await axios.post(`${API_URL}/api/admin/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.url;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to upload image');
    }
};
