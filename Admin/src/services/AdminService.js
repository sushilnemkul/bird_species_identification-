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

export const suspendUser = async (userId) => {
    try {
        const response = await axios.patch(`${API_URL}/api/admin/users/${userId}/suspend`);
        return response.data;
    } catch (error) {
        console.error('Error suspending user:', error);
        throw new Error(error.response?.data?.error || 'Failed to suspend user');
    }
};

export const unsuspendUser = async (userId) => {
    try {
        const response = await axios.patch(`${API_URL}/api/admin/users/${userId}/unsuspend`);
        return response.data;
    } catch (error) {
        console.error('Error unsuspending user:', error);
        throw new Error(error.response?.data?.error || 'Failed to unsuspend user');
    }
};

export const flagUser = async (userId) => {
    try {
        const response = await axios.patch(`${API_URL}/api/admin/users/${userId}/flag`);
        return response.data;
    } catch (error) {
        console.error('Error flagging user:', error);
        throw new Error(error.response?.data?.error || 'Failed to flag user');
    }
};

export const unflagUser = async (userId) => {
    try {
        const response = await axios.patch(`${API_URL}/api/admin/users/${userId}/unflag`);
        return response.data;
    } catch (error) {
        console.error('Error unflagging user:', error);
        throw new Error(error.response?.data?.error || 'Failed to unflag user');
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
