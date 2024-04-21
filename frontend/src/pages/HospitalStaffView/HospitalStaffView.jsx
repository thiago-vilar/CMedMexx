import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Form, Alert, Dropdown, DropdownButton, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HospitalStaffView.css';
import { useAuth } from '../../contexts/AuthContext';

const HospitalStaffView = () => {
    const { currentUser } = useAuth();
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [roomDetails, setRoomDetails] = useState({
        HospitalName: '',
        RoomName: '',
        timeSlot: '08:00-12:00',
        Start: '',
        End: '',
        UserId: ''
    });
    const [dropdownTitle, setDropdownTitle] = useState("Escolha o Horário");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.userId) {
            console.log("Current user's userId before setting:", currentUser.userId); // Log the userId before setting
    
            setRoomDetails(prevDetails => {
                console.log("Previous roomDetails:", prevDetails); // Log the previous state before updating
    
                const newDetails = {
                    ...prevDetails,
                    UserId: currentUser.userId
                };
    
                console.log("Updated roomDetails with UserId:", newDetails); // Log the new state after updating
                return newDetails;
            });
        }
    }, [currentUser]);
    
  
    
        const fetchEvents = async () => {
            try {
                
                const responseuser = await axios.get('http://localhost:5000/api/user/email/' + localStorage.getItem ('email'));


                
                
                const response = await axios.get('http://localhost:5000/api/room/hospitalstaff/' + responseuser.data.userId) ;
                console.log(response.data)
                
                setEvents(response.data.map(event => ({
                    title: `${event.hospitalName} - Sala ${event.roomName}`,
                    date: event.start,
                })));
            } catch (error) {
                console.error('Failed to fetch events:', error);
                setError('Failed to load events.');
            }
        };
        useEffect(() => {
            fetchEvents();
        }, []);

    const handleDateClick = (selectInfo) => {
        setRoomDetails(prev => ({
            ...prev,
            Start: selectInfo.dateStr + "T08:00:00Z",
            End: selectInfo.dateStr + "T12:00:00Z"
        }));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError('');
        setSuccess('');
    };

    const submitRoomDetails = async () => {
        setLoading(true);
        try {

            const responseuser = await axios.get('http://localhost:5000/api/user/email/' + localStorage.getItem ('email'));
           
            console.log(responseuser.data)

            roomDetails.UserId = responseuser.data.userId
            ;

            await axios.post('http://localhost:5000/api/room/add', roomDetails);
            fetchEvents ();

            setSuccess('Disponibilidade da sala adicionada com sucesso.');
        } catch (error) {
            console.error('Error adding room:', error);
            setError(`Erro: ${error.response?.data || error.message}`);
        } finally {
            setLoading(false);
            handleCloseModal();
        }
    };

    return (
        <div className="hospital-staff-view">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            {loading && <div>Loading...</div>}
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                locale="pt"
                contentHeight="auto"
                eventContent={(eventInfo) => (
                    <div><strong>{eventInfo.event._def.title}</strong></div>
                )}
            />
            <ListGroup className="mt-3">
                {events.map((event, index) => (
                    <ListGroup.Item key={index}>
                        {event.title} - {event.date}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Disponibilizar Sala</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome do Hospital</Form.Label>
                            <Form.Control type="text" value={roomDetails.HospitalName}
                                onChange={(e) => setRoomDetails({ ...roomDetails, HospitalName: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome da Sala</Form.Label>
                            <Form.Control type="text" value={roomDetails.RoomName}
                                onChange={(e) => setRoomDetails({ ...roomDetails, RoomName: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Horário</Form.Label>
                            <DropdownButton id="dropdown-basic-button" title={dropdownTitle}
                                onSelect={(e) => {
                                    setRoomDetails({ ...roomDetails, timeSlot: e });
                                    setDropdownTitle(e);
                                }}>
                                <Dropdown.Item eventKey="08:00-12:00">08:00-12:00</Dropdown.Item>
                                <Dropdown.Item eventKey="13:00-17:00">13:00-17:00</Dropdown.Item>
                                <Dropdown.Item eventKey="18:00-22:00">18:00-22:00</Dropdown.Item>
                            </DropdownButton>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Fechar</Button>
                    <Button variant="primary" onClick={submitRoomDetails}>Salvar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HospitalStaffView;
