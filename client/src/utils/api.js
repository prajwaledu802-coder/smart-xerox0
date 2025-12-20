import axios from 'axios';
import useStore from '../store/useStore';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 Unauthorized globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            // We can't access store directly here effectively without causing circular dependency or issues outside component
            // But we can try to rely on the app state reacting to failed requests or just redirect
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
