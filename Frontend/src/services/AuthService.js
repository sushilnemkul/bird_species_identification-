import axios from 'axios';

// Use environment variable with fallback to 127.0.0.1 for development
const API_URL = `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api`;
const TOKEN_KEY = 'bird_id_token';
const USER_KEY = 'bird_id_user';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { user, token } = response.data;

        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        return { user };
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Login failed');
    }
};

export const register = async (name, email, password) => {
    try {
        await axios.post(`${API_URL}/auth/register`, { name, email, password });
        return { success: true };
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Registration failed');
    }
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = async () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    return JSON.parse(userStr);
};

export const updateProfile = async (userId, data) => {
    try {
        const response = await axios.post(`${API_URL}/user/update`, { user_id: userId, ...data });
        const { user } = response.data;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Profile update failed');
    }
};

export const changePassword = async (userId, oldPassword, newPassword) => {
    try {
        await axios.post(`${API_URL}/user/change-password`, {
            user_id: userId,
            old_password: oldPassword,
            new_password: newPassword
        });
        return { success: true };
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Password change failed');
    }
};
