import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DoctorView.css';

const DoctorView = () => {
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');
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
                            console.log ({availableAppointments})
                            const response = availableAppointments.filter(room => room.roomRentalId == d.roomRentalId)[0]
                         
                            const item = {
                                ...d,
                            data: response,   
                                
                            };
                            console.log({itemAppointiment: item});
                        
                        setAppointments(All => [...All, item]);
                        })
                    })
    }, [availableAppointments]);
    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = () => {
        axios.get('http://localhost:5000/api/room/available')
            .then(response => {
                setRooms(response.data);
                console.log('Rooms:', response.data);
            })
            .catch(error => {
                console.error('Failed to fetch rooms:', error);
                setError('Failed to load rooms.');
            });
    };

    const bookRoom = (roomId) => {
        axios.patch(`http://localhost:5000/api/room/book/${roomId}`,{
            StartDateTime: new Date(),
            EndDateTime: new Date(),
            DoctorId:localStorage.getItem('userId')
        })
            .then(response => {
                fetchRooms(); // Refresh the room list after booking
            })
            .catch(error => {
                console.error('Error booking room:', error);
                setError('Failed to book room.');
            });
    };
    const handleEventClick = (room) => {
        axios.patch(`http://localhost:5000/api/Appointment/confirm/${room.appointmentId}`)
        .then(response => {
            fetchRooms(); // Refresh the room list after booking
            fetchingData();
        })
    }
    return (
        <Container className="doctor-view">
            <h2>Available Rooms</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={rooms.map(room => ({
                    title: room.RoomName,
                    start: room.Start,
                    end: room.End,
                    color: room.IsBooked ? '#007bff' : '#28a745' // Blue for booked, green for available
                }))}
            />
            <h1>ROOMS</h1>
            <Row className="mt-3">
                {rooms.map(room => (
                    <Col md={4} key={room.roomId}>
                        <Card style = {{backgroundColor: room.isBooked? "blue":"white" }}>
                            <Card.Body>
                                <Card.Title>{room.roomName}</Card.Title>
                                <Card.Text>
                                    Hospital: {room.hospitalName}
                                    <br />
                                    Status: {room.isBooked ? "Booked" : "Available"}
                                </Card.Text>
                                <Button onClick={() => bookRoom(room.roomId)} disabled={room.isBooked}>
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
                                </Card.Text>
                                <Button onClick={() => handleEventClick(room)} disabled={room.isConfirmed}>
                                    Book Room
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default DoctorView;
