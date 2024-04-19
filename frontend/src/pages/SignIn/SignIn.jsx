//C:\Projetos\CMedMexx\frontend\src\pages\SignIn\SignIn.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignIn.css';

function SignIn() {
    const [credentials, setCredentials] = useState({ Email: '', Password: '' });
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const { Email, Password } = credentials;

        try {
            const response = await axios.post('http://localhost:5000/api/auth/signin', { Email, Password });
            if (response.data.isSuccess) {
                const { token, role, username, email, userId } = response.data;

                // Armazenar no localStorage os novos dados incluídos na resposta
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                localStorage.setItem('username', username);
                localStorage.setItem('email', email); // Novo
                localStorage.setItem('userId', userId.toString()); // Novo

                // Navegação baseada no papel do usuário
                switch (role) {
                    case 'hospitalstaff':
                        navigate('/HospitalStaffView');
                        break;
                    case 'doctor':
                        navigate('/DoctorView');
                        break;
                    case 'patient':
                        navigate('/PatientView');
                        break;
                    default:
                        console.error('Role not recognized:', role);
                        alert('Papel do usuário não reconhecido');
                        break;
                }
            } else {
                alert('Credenciais inválidas, tente novamente.');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert(`Login falhou: ${error.response?.data.message || 'Credenciais inválidas'}`);
        }
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="signin-container">
            <h2>Conecte-se</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    name="Email"
                    className="signin-input"
                    placeholder="E-mail" 
                    value={credentials.Email} 
                    onChange={handleChange} 
                    autoComplete="off"
                />
                <input 
                    type="password" 
                    name="Password"
                    className="signin-input"
                    placeholder="Senha" 
                    value={credentials.Password} 
                    onChange={handleChange} 
                    autoComplete="off"
                />
                <button type="submit" className="signin-button">Login</button>
            </form>
        </div>
    );
}

export default SignIn;
