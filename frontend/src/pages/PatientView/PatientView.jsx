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
    const [appointments, setAppointments] = useState([]);

    const fetchingData = () => {
        // Suponha que temos uma endpoint API que retorna as consultas disponíveis para agendamento
        axios.get('http://localhost:5000/api/RoomRental')
            .then(async response => { 
                console.log ({response: response.data[0]});
                setAvailableAppointments([]);
            

                await response.data.map(async d => {
                    
                    const userresponse = await axios.get(`http://localhost:5000/api/user/${d.userId}`)
                    const response = await axios.get(`http://localhost:5000/api/room/${d.roomId}`)
                    console.log(response.data);
                    const item = {
                        ...d,
                        ...response.data ,
                        id: response.data.roomId,
                        roomRentalId: d.roomRentalId,
                        title: response.data.hospitalName + ' - ' + userresponse.data.username, 
                        start: response.data.start,
                        end: response.data.end,
                        isConfirmed: d.isConfirmed,

                        
                    };
                    console.log({item: item});
                
                setAvailableAppointments(All => [...All, item]);
                })

                
                
            })
            .catch(error => {
                console.error('Error fetching available appointments:', error);
            });
        
    }

    useEffect(() => {fetchingData()}, []);
    useEffect(() => {
            axios.get('http://localhost:5000/api/Appointment')
                    .then(async response => { 
                        console.log ({response: response.data});
                        setAppointments([]);
                    

                        await response.data.map(async d => {
                            
                            const response = availableAppointments.filter(room => room.roomRentalId == d.roomRentalId) [0]
                         
                            const item = {
                                ...d,
                            data: response,   
                                
                            };
                            console.log({itemAppointiment: item});
                        
                        setAppointments(All => [...All, item]);
                        })
                    })
    }, [availableAppointments]);
    const handleCalendarClick = (info) => {
        handleEventClick (info.event);
    };

    const handleEventClick = (appointment) => {
       
        if (window.confirm(`Would you like to book an appointment with ${appointment.title}?`)) {
            // Aqui você pode adicionar lógica para realizar o agendamento no backend
            console.log({appointment: appointment})
            axios.post('http://localhost:5000/api/Appointment', {
                
                userId: appointment.userId,
                roomRentalId: appointment.roomRentalId,
                start: appointment.start,
                end: appointment.end,
                isConfirmed: false,
            })
            .then(response => {
                alert('Appointment booked successfully!');
                console.log ({response: response.data});
                axios.patch(`http://localhost:5000/api/RoomRental/confirm/`+ appointment.roomRentalId )
                // Remover ou atualizar o evento no calendário conforme necessário
                fetchingData();
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
                eventClick={handleCalendarClick}
            />
            <h1>Rooms</h1>
            <Row className="mt-3">
                {availableAppointments.map(room => (
                    <Col md={4} key={room.roomId}>
                        <Card style = {{backgroundColor: room.isConfirmed? "yellow":"blue" }}>
                            <Card.Body>
                                <Card.Title>{room.roomName}</Card.Title>
                                <Card.Text>
                                    Hospital: {room.hospitalName}
                                    <br />
                                    Status: {room.isConfirmed ? "Booked" : "Available"}
                                </Card.Text>
                                <Button onClick={() => handleEventClick(room)} disabled={room.isConfirmed}>
                                    Book Room
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <h1>Appointments</h1>
            <Row className="mt-3">
                {appointments.map(room => (
                    <Col md={4} key={room.data?.roomId}>
                        <Card style = {{backgroundColor: room.isConfirmed? "green":"orange" }}>
                            <Card.Body>
                                <Card.Title>{room.data?.roomName}</Card.Title>
                                <Card.Text>
                                    Hospital: {room.data?.hospitalName}
                                    <br />
                                    Status: {room.isConfirmed ? "Booked" : "Available"}
                                    <br />
                                    Info: {room.data?.title}
                                </Card.Text>
                                
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PatientView;
