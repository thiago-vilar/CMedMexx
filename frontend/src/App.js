import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp/SignUp';
import HospitalStaffView from './pages/HospitalStaffView/HospitalStaffView';
import DoctorView from './pages/DoctorView/DoctorView';
import PatientView from './pages/PatientView/PatientView';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  // Configura o interceptador do Axios para adicionar o token JWT em cada requisição
  axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/HospitalStaffView" element={<HospitalStaffView />} />
          <Route path="/DoctorView" element={<DoctorView />} />
          <Route path="/PatientView" element={<PatientView />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
