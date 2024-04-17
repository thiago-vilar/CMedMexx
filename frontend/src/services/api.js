//C:\Projetos\CMedMexx\frontend\src\services\api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(response => response, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const { data } = await api.post('/auth/refresh-token');
            localStorage.setItem('token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return api(originalRequest);
        } catch (refreshError) {
            console.error('Erro ao renovar token:', refreshError);
            localStorage.removeItem('token'); // Remover token inválido/expirado
            window.location = '/signin'; // Redireciona para a página de login
        }
    }
    return Promise.reject(error);
});

export default api;
