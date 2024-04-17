//C:\Projetos\CMedMexx2\CMedMexx\frontend\src\contexts\AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Provider of the context
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Attempt to recover the user from localStorage when the component loads
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Function to perform login
    const login = async (credentials) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/signin', credentials);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
        } catch (error) {
            console.error('Login failed:', error);
            // Depending on your application's needs, you might want to handle errors differently
            throw error; // This allows the login component to handle the error with a catch block
        }
    };

    // Function to perform logout
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
