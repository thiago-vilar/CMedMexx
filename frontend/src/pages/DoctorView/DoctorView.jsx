import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import TextField from '@material-ui/core/TextField';
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
        const userId = localStorage.getItem('userId');

            axios.get('http://localhost:5000/api/Appointment/doctor/'+userId)
                    .then(async response => { 
                        console.log ({response: response.data});
                        setAppointments([]);
                    

                        await response.data.map(async d => {
                            console.log ({availableAppointments})
                            const response = availableAppointments.filter(room => room.roomRentalId === d.roomRentalId)[0]
                         
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
            startDateTime: new Date(),
            endDateTime: new Date(),
            DoctorId:localStorage.getItem('userId')
        })
            .then(response => {
                fetchRooms(); // Refresh the room list after booking
            })
            .catch(error => {
                console.error('Error booking room:', error);
                setError('Falha em alugar a sala. Já reservada!.');
            });
    };
    const handleEventClick = (room) => {
        axios.patch(`http://localhost:5000/api/Appointment/confirm/${room.appointmentId}`)
        .then(response => {
            fetchRooms(); // Refresh the room list after booking
            fetchingData();
        })
    };
    
    return (
        <Container className="doctor-view">
            <br />
            <h2>ALUGUEL DE SALAS</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="pt"
                events={rooms.map(room => ({
                    title: `${room.roomName} - ${room.hospitalName} (${room.start} to ${room.end})`,
                    start: room.start,
                    end: room.end,
                    color: room.isBooked ? 'blue' : 'lightgrey',
                    id: room.roomId // This is needed to identify the room in the eventClick handler
                }))}
                eventClick={(info) => bookRoom(info.event.id)}
            />
            <br />
            <h1>SALAS DISPONÍVES PARA ALUGUEL</h1>
            <p>Ao alugar uma sala, torne-se disponível para consulta automaticamente! </p>
            <Row className="mt-3">
                {rooms.map(room => (
                    <Col md={4} key={room.roomId}>
                        <Card style = {{backgroundColor: room.isBooked? "blue":"white" }}>
                            <Card.Body>
                                <Card.Title>{room.roomName}</Card.Title>
                                <Card.Text>
                                <TextField label={<b>Hospital</b>} variant="outlined" value={room.hospitalName}/>
                                    <br />
                                    start: {room.start}
                                    <br />
                                    end: {room.end}
                                    <br />
                                    Status: {room.isBooked ? "Alugada" : "Disponível"}
                                </Card.Text>
                                <Button onClick={() => bookRoom(room.roomId)} disabled={room.isBooked}>
                                    ALUGAR
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <h1>AGENDA DE CONSULTAS</h1>
            <Row className="mt-3">
                {appointments.map(room => (
                    <Col md={4} key={room.data?.roomId}>
                        <Card style = {{backgroundColor: room.isConfirmed? "green":"orange" }}>
                            <Card.Body>
                                <Card.Title>{room.data?.roomName}</Card.Title>
                                <Card.Text>
                                    <TextField label={<b>Paciente</b>} variant="outlined" value={room.user.username}/>

                                    <br />
                                    start: {room.start}
                                    <br />
                                    end: {room.end}
                                    <br />
                                    Status: {room.isConfirmed ? "Consulta Confirmada" : "Consulta Pendente"}
                                </Card.Text>
                                <Button onClick={() => handleEventClick(room)} disabled={room.isConfirmed}>
                                    CONFIRMAR
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