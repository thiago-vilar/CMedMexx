//C:\Projetos\CMedMexx\frontend\src\components\NavBar\NavBar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/signin');
    };

    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    // Função para obter o pronome de tratamento baseado no papel do usuário
    const getSalutation = (role) => {
        switch (role) {
            case 'hospitalstaff':
                return 'Administrador(a)';
            case 'doctor':
                return 'Dr(a)';
            case 'patient':
                return 'Sr(a)';
            default:
                return '';
        }
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">Portal Médico Mexx</Link>
            <div className="navbar-nav">
                {username ? (
                    <>
                        <span>Bem-vindo, {getSalutation(role)} {username}!</span>
                        <div className="navbar-links">
    {role === 'hospitalstaff' && <Link to="/HospitalStaffView">Painel Administrativo</Link>}
    {role === 'doctor' && <Link to="/DoctorView">Painel do Médico</Link>}
    {role === 'patient' && <Link to="/PatientView">Painel do Paciente</Link>}
    <button onClick={handleLogout}>Logout</button>
</div>
</>
) : (
<div>
    <Link className="link-spacing" to="/signin">Login</Link>
    <Link className="link-spacing" to="/signup">Cadastre-se aqui!</Link>
</div>
)}
</div>
</nav>
);
};

export default NavBar;
