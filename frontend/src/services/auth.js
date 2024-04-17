// C:\Projetos\CMedMexx\frontend\src\services\auth.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const register = (userData) => {
    return axios.post(`${API_URL}signup`, userData);
};

const login = (email, password) => {
    return axios.post(`${API_URL}signin`, {
        email,
        password,
    }).then(response => {
        if (response.data.token) {
            // Store only the token and basic user information
            localStorage.setItem('user', JSON.stringify({
                token: response.data.token,
                email: response.data.email,
                role: response.data.role,
                username: response.data.username  // Ensuring username is included as it's used elsewhere
            }));
        }
        return response.data;
    });
};

const logout = () => {
    localStorage.removeItem('user');
};

const validateToken = () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.token) {
        return axios.post(`${API_URL}validate`, {
            token: userData.token,
        }).then(response => {
            return response.data.isValid ? userData : null;
        }).catch(() => {
            localStorage.removeItem('user');
            return null;
        });
    }
    return Promise.resolve(null);
};

const authService = {
    register,
    login,
    logout,
    validateToken,
};

export default authService;
