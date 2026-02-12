import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend-05s5.onrender.com' // Removed /api prefix to match backend refactor
});

// Automatic token attachment middleware
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
