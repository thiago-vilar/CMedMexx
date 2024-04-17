// C:\Projetos\000cmed-mexx\1frontendweb\src\pages\Home\Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <header className="welcome-banner">
        <h1>Bem-vindo ao Portal Médico MEXX</h1>
        <p>O seu portal de saúde e agendamento de consultas</p>
      </header>

      <section className="journey-cards">
        <div className="card" onClick={() => navigate('/signin')}>
          <h2>Paciente</h2>
          <p>Agende sua consulta rapidamente e com facilidade.</p>
        </div>
        <div className="card" onClick={() => navigate('/signin')}>
          <h2>Médico</h2>
          <p>Acesse sua agenda e conecte-se com seus pacientes.</p>
        </div>
        <div className="card" onClick={() => navigate('/signin')}>
          <h2>Hospital</h2>
          <p>Gerencie horários, médicos e salas de atendimento.</p>
        </div>
      </section>

      <section className="main-calendar">
        <h2>Agenda</h2>
        <div className="calendar">
          <Calendar locale="pt-BR" />
        </div>
      </section>

      <aside className="report-card">
        <h3>Relatório de Marcações</h3>
        <p>Visualize as estatísticas das suas marcações.</p>
      </aside>

      <section className="marketing-messages">
        <div>
          <p>Facilitando o acesso à saúde todos os dias.</p>
          <p> </p>
          <p>Seu bem-estar é nossa maior prioridade.</p>
        </div>
        
        <div className="health-card">
          Verifique seu plano de Saúde!
        </div>
      </section>
    </main>
  );
};



export default Home;