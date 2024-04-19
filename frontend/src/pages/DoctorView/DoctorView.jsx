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
            <Row className="mt-3">
                {rooms.map(room => (
                    <Col md={4} key={room.roomId}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{room.roomName}</Card.Title>
                                <Card.Text>
                                    Hospital: {room.hospitalName}
                                    <br />
                                    Status: {room.isBooked ? "Booked" : "Available"}
                                </Card.Text>
                                <Button variant="primary" onClick={() => bookRoom(room.roomId)} disabled={room.isBooked}>
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
