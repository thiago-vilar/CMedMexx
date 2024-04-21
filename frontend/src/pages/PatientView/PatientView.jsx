import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';
import TextField from '@material-ui/core/TextField';
import { formatInTimeZone } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PatientView.css';

const timeZone = 'UTC';

const formatDate = (dateString) => {
    return formatInTimeZone(new Date(dateString), timeZone, 'PPpp', { locale: ptBR });
};

const PatientView = () => {
    const [availableAppointments, setAvailableAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const fetchData = async () => {
        try {
            const roomResponse = await axios.get('http://localhost:5000/api/RoomRental');
            const roomData = await Promise.all(roomResponse.data.map(async d => {
                const userResponse = await axios.get(`http://localhost:5000/api/user/${d.userId}`);
                const roomDetailsResponse = await axios.get(`http://localhost:5000/api/room/${d.roomId}`);
                return {
                    ...d,
                    ...roomDetailsResponse.data,
                    title: `${roomDetailsResponse.data.hospitalName} - ${userResponse.data.username}`,
                    start: roomDetailsResponse.data.start,
                    end: roomDetailsResponse.data.end,
                    isConfirmed: d.isConfirmed,
                };
            }));
            setAvailableAppointments(roomData);
        } catch (error) {
            console.error('Error fetching available appointments:', error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const appointmentsResponse = await axios.get('http://localhost:5000/api/Appointment');
            const newAppointments = appointmentsResponse.data.map(appointment => {
                const matchingRoom = availableAppointments.find(room => room.roomRentalId === appointment.roomRentalId);
                return {
                    ...appointment,
                    data: matchingRoom,
                };
            });
            setAppointments(newAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (availableAppointments.length > 0) {
            fetchAppointments();
        }
    }, [availableAppointments]);

    const handleEventClick = (appointment) => {
        if (window.confirm(`Você gostaria de agendar sua consulta em: ${appointment.title}?`)) {
            axios.post('http://localhost:5000/api/Appointment', {
                userId: appointment.userId,
                roomRentalId: appointment.roomRentalId,
                start: appointment.start,
                end: appointment.end,
                isConfirmed: false,
            })
            .then(response => {
                alert('Appointment booked successfully!');
                axios.patch(`http://localhost:5000/api/RoomRental/confirm/${appointment.roomRentalId}`)
                .then(() => {
                    fetchData();  // Refetch data to reflect the changes
                })
            })
            .catch(error => {
                console.error('Error booking appointment:', error);
                alert('Error booking appointment');
            });
        }
    };

    return (
        <div className="patient-view">
            <h2>MARQUE SUAS CONSULTAS</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="pt"
                events={availableAppointments.map(appointment => ({
                    title: `${appointment.title} (${formatDate(appointment.start)} to ${formatDate(appointment.end)})`,
                    start: appointment.start,
                    end: appointment.end,
                    color: appointment.isConfirmed ? "#FFD700" : "#ADD8E6", // Assumindo que 'isConfirmed' indica se está reservado ou não
                    id: appointment.roomRentalId // Usando 'roomRentalId' para identificar o compromisso no handler de clique
                }))}
                eventClick={(info) => handleEventClick(info.event)}
            />

       
            <br />
            <h1>AGENDÁVEIS - REQUISIÇÃO DE CONSULTAS</h1>
            <br />
            <Row className="mt-5">
                {availableAppointments.map(room => (
                     <Col md={4} key={room.roomId} className="mb-4">
                        <Card className="mb-5 p-25" style={{backgroundColor: room.isConfirmed ? "#FFD700" : "#ADD8E6"}}>
                            <Card.Body>
                                <br />
                                <Card.Title>{room.title}</Card.Title>
                                <TextField
                                  label="Hospital"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  margin="dense"
                                  value={room.hospitalName}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Horário"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  margin="dense"
                                  value={`${formatDate(room.start)} - ${formatDate(room.end)}`}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <TextField
                                  label="Status"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  margin="dense"
                                  value={room.isConfirmed ? "Agendada" : "Disponível"}
                                  InputProps={{
                                    readOnly: true,
                                  }}
                                />
                                <Button onClick={() => handleEventClick(room)} disabled={room.isConfirmed} className="mt-2 w-100">
                                    AGENDAR
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <h1>CONSULTAS</h1>
            <Row className="mt-5" >
                {appointments.map(room => (
                    <Col md={4} key={room.data?.roomId}>
                        <Card className="mb-4 p-3" style={{backgroundColor: room.isConfirmed ? "#32CD32" : "#FFA500"}}>
                            <Card.Body>
                                <Card.Title>{room.data?.title}</Card.Title>
                                <TextField
                                label="Horário"
                                variant="outlined"
                                size="small"
                                fullWidth
                                margin="dense"
                                value={`${formatDate(room.start)} - ${formatDate(room.end)}`}
                                InputProps={{
                                    readOnly: true,
                                }}
                                
                                />
                                <Card.Text style={{color: room.isConfirmed ? "#dddddd" : "#555555"}}>
                                   
                                    Status: {room.isConfirmed ? "Consulta Confirmada" : "Consulta Agendada"}
                                    
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
