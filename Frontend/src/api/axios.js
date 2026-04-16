import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor to attach the JWT token automatically
axiosPrivate.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const axiosPublic = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});