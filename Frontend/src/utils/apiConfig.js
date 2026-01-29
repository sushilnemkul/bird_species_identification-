/**
 * API Configuration Helper
 * Centralized API configuration and utilities
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get the full API URL for an endpoint
 * @param {string} endpoint - API endpoint (e.g., '/api/auth/login')
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_URL}/${cleanEndpoint}`;
};

/**
 * Default axios configuration
 */
export const apiConfig = {
    baseURL: API_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
};

/**
 * Get auth headers for authenticated requests
 * @returns {Object} Headers with authorization token
 */
export const getAuthHeaders = () => {
    const token = localStorage.getItem('bird_id_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
    API_URL,
    getApiUrl,
    apiConfig,
    getAuthHeaders,
};
