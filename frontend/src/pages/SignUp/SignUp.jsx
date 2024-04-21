//C:\Projetos\CMedMexx\frontend\src\pages\SignUp\SignUp.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import para navegação programática
import authService from '../../services/auth';   // Serviço de autenticação
import './SignUp.css';  // Arquivo de estilo

const SignUp = () => {
  const [role, setRole] = useState('');
  const [dados, setDados] = useState({
    Username: '',
    Email: '',
    Password: '',
    cpf: '',
    telefone: '',
    endereco: '',
    crm: '',
    cnpj: '',
    nomeResponsavel: '',
  });

  const navigate = useNavigate();  // Instância de useNavigate para redirecionamento

  // Função para lidar com mudanças nos inputs
  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dados.Email || !dados.Password) {
      alert('E-mail e senha são obrigatórios!');
      return;
    }

    try {
      const response = await authService.register({ ...dados, Role: role });
      if (response.status === 200) {
        alert('Usuário cadastrado com sucesso!');
        navigate('/signin');  // Redireciona para SignIn após sucesso no cadastro
      } else {
        alert(`Erro no cadastro: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      alert('Credenciais inválidas.');
    }
  };

  // Renderização do componente
  return (
    <div className="signup-container">
      <h2>Cadastro</h2>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Selecione o tipo de usuário</option>
        <option value="patient">Paciente</option>
        <option value="doctor">Médico</option>
        <option value="hospitalstaff">Funcionário do Hospital</option>
      </select>

      <form onSubmit={handleSubmit}>
        <input type="text" name="Username" value={dados.Username} onChange={handleChange} placeholder="Nome de usuário" required />
        <input type="email" name="Email" value={dados.Email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="Password" value={dados.Password} onChange={handleChange} placeholder="Senha" required />
        <button type="submit" className="register-button">Registrar</button>
      </form>
    </div>
  );
};

export default SignUp;
