// C:\Projetos\CMedMexx\frontend\src\pages\PatientView\PatientView.jsx

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Card, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PatientView.css';

const PatientView = () => {
    const [availableAppointments, setAvailableAppointments] = useState([]);

    useEffect(() => {
        // Suponha que temos uma endpoint API que retorna as consultas disponíveis para agendamento
        axios.get('http://localhost:5000/api/RoomRental')
            .then(async response => { 
                console.log (response.data);
                let formattedAppointments = [];
              

                await response.data.map(async d => {
                    
                    const userresponse = await axios.get(`http://localhost:5000/api/user/${d.userId}`)
                    const response = await axios.get(`http://localhost:5000/api/room/${d.roomId}`)
                    console.log(response.data, userresponse.data);
                    formattedAppointments.push({
                        ...response.data ,
                        id: response.data.roomId,
                        title: response.data.hospitalName + ' - ' + userresponse.data.username, 
                        start: response.data.start,
                        end: response.data.end,
                        
                    });
                console.log(formattedAppointments);
                setAvailableAppointments(formattedAppointments);
                })
                
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
            <Row className="mt-3">
                {availableAppointments.map(room => (
                    <Col md={4} key={room.roomId}>
                        <Card style = {{backgroundColor: room.isBooked? "blue":"white" }}>
                            <Card.Body>
                                <Card.Title>{room.roomName}</Card.Title>
                                <Card.Text>
                                    Hospital: {room.hospitalName}
                                    <br />
                                    Status: {room.isBooked ? "Booked" : "Available"}
                                </Card.Text>
                                <Button onClick={() => handleEventClick(room.roomId)} disabled={room.isBooked}>
                                    Book Room
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PatientView;
