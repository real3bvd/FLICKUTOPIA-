import axios from 'axios';
import { auth } from '../firebase';

// API base URL
const API_BASE = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to every request
api.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            try {
                // Get fresh Firebase ID token
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                console.error('Failed to get auth token:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors (optional: auto-logout on 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized - token may be invalid or expired');
            // Optionally: redirect to login or refresh token
        }
        return Promise.reject(error);
    }
);

export default api;
export { API_BASE };
