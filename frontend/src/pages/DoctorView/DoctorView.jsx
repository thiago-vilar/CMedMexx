// C:\Projetos\CMedMexx\frontend\src\pages\DoctorView\DoctorView.jsx

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './DoctorView.css';

const DoctorView = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // Suponha que temos uma endpoint API que retorna as consultas agendadas para o médico
        axios.get('http://localhost:5000/api/appointments/doctor')
            .then(response => {
                const formattedAppointments = response.data.map(appointment => ({
                    title: appointment.patientName + " - " + appointment.reason,
                    start: appointment.startTime,
                    end: appointment.endTime
                }));
                setAppointments(formattedAppointments);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    }, []);

    // Função para manipular a seleção de horário (pode ser usada para ajustar consultas)
    const handleEventClick = (clickInfo) => {
        if (window.confirm(`Are you sure you want to delete the appointment with ${clickInfo.event.title}?`)) {
            clickInfo.event.remove();

            // Aqui você pode adicionar lógica para deletar a consulta do backend
            axios.delete(`http://localhost:5000/api/appointments/delete/${clickInfo.event.id}`)
                .then(response => {
                    console.log('Appointment deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting appointment:', error);
                });
        }
    };

    return (
        <div className="doctor-view">
            <h2>Doctor's Appointments</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridWeek"
                events={appointments}
                eventClick={handleEventClick}
            />
        </div>
    );
};

export default DoctorView;
