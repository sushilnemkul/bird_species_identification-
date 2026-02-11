import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/auth';


export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.token) {
            localStorage.setItem('admin_token', response.data.token);
            localStorage.setItem('admin_user', JSON.stringify(response.data.user));
            localStorage.setItem('admin_role', response.data.role);
        }
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Login failed');
    }
};

export const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_role');
};

export const checkAuth = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return null;

    try {
        // Verify token with backend
        const response = await axios.get('http://127.0.0.1:5000/api/auth/verify', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return {
            user: response.data.user,
            role: response.data.role
        };
    } catch (error) {
        logout();
        return null;
    }
};

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('admin_user'));
};
