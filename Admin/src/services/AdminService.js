import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

export const getUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error(error.response?.data?.error || 'Failed to fetch users');
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
};

export const getAnalytics = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/analytics`);
        return response.data;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        throw new Error(error.response?.data?.error || 'Failed to fetch analytics');
    }
};
