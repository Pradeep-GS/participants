import axios from 'axios';

// baseURL is either from env variable or defaults to '/api' for relative path usage (StackBlitz/Production)
// In development, Vite proxys /api to http://localhost:5000
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api'
});

// Automatic token attachment middleware (Interceptor)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Optional: Logout user if token is expired
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

