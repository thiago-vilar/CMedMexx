import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

// Função para registrar um novo usuário
const register = (userData) => {
    return axios.post(`${API_URL}signup`, userData);
};

// Função para realizar o login do usuário
const login = (email, password) => {
    return axios.post(`${API_URL}signin`, { email, password })
        .then(response => {
            if (response.data.token) {
                // Armazena o token e outras informações relevantes do usuário retornadas pelo backend
                localStorage.setItem('user', JSON.stringify({
                    token: response.data.token,
                    email: response.data.email,
                    role: response.data.role,
                    username: response.data.username,
                    userId: response.data.userId  // Garantir que o userId esteja armazenado, caso esteja incluído na resposta
                }));
            }
            return response.data;
        });
};

// Função para deslogar o usuário
const logout = () => {
    localStorage.removeItem('user');
};

// Função para validar o token do usuário
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

// Agrupar todas as funções de autenticação em um objeto de serviço
const authService = {
    register,
    login,
    logout,
    validateToken,
};

export default authService;
