// C:\Projetos\CMedMexx\frontend\src\pages\PatientView\PatientView.jsx

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import './PatientView.css';

const PatientView = () => {
    const [availableAppointments, setAvailableAppointments] = useState([]);

    useEffect(() => {
        // Suponha que temos uma endpoint API que retorna as consultas disponíveis para agendamento
        axios.get('http://localhost:5000/api/appointments/available')
            .then(response => {
                const formattedAppointments = response.data.map(appointment => ({
                    id: appointment.id,
                    title: appointment.doctorName + " - " + appointment.specialization,
                    start: appointment.startTime,
                    end: appointment.endTime,
                    extendedProps: {
                        doctorId: appointment.doctorId
                    }
                }));
                setAvailableAppointments(formattedAppointments);
            })
            .catch(error => {
                console.error('Error fetching available appointments:', error);
            });
    }, []);

    const handleEventClick = (clickInfo) => {
        if (window.confirm(`Would you like to book an appointment with ${clickInfo.event.title}?`)) {
            // Aqui você pode adicionar lógica para realizar o agendamento no backend
            axios.post('http://localhost:5000/api/appointments/book', {
                appointmentId: clickInfo.event.id,
                doctorId: clickInfo.event.extendedProps.doctorId
            })
            .then(response => {
                alert('Appointment booked successfully!');
                // Remover ou atualizar o evento no calendário conforme necessário
            })
            .catch(error => {
                console.error('Error booking appointment:', error);
                alert('Error booking appointment');
            });
        }
    };

    return (
        <div className="patient-view">
            <h2>Book Your Appointment</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={availableAppointments}
                eventClick={handleEventClick}
            />
        </div>
    );
};

export default PatientView;
