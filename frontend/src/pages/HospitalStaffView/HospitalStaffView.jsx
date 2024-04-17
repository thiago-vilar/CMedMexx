//C:\Projetos\CMedMexx2\CMedMexx\frontend\src\pages\HospitalStaffView\HospitalStaffView.jsx
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { Modal, Button, Form, Alert, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HospitalStaffView.css';
import { useAuth } from '../../contexts/AuthContext';


const HospitalStaffView = () => {
    const { currentUser } = useAuth(); // Obtendo o usuário atual do contexto
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [roomDetails, setRoomDetails] = useState({
        hospitalName: '',
        roomName: '',
        timeSlot: '08:00-12:00',
        start: '',
        end: '',
        UserId: ''
    });
    const [dropdownTitle, setDropdownTitle] = useState("Escolha o Horário");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    
    useEffect(() => {
        // Definindo UserId assim que currentUser é carregado ou atualizado
        if (currentUser && currentUser.id) {
            setRoomDetails(prevDetails => ({
                ...prevDetails,
                UserId: currentUser.id
            }));
        }
    }, [currentUser]);

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        
        if (!storedRole || storedRole !== 'hospitalstaff') {
            setError('Acesso negado. Apenas administradores de hospital podem acessar esta página.');
            return;
        }

        axios.get('http://localhost:5000/api/room')
            .then(response => {
                setEvents(response.data.map(event => ({
                    title: `${event.hospitalName} - Sala ${event.roomName}`,
                    start: event.start,
                    end: event.end,
                    backgroundColor: event.IsBooked ? '#546E7A' : '#90E3EE',
                    timeSlot: event.timeSlot,
                    hospitalName: event.hospitalName,
                })));
            })
            .catch(error => {
                setError(`Falha ao buscar eventos: ${error.response?.statusText || error.message}`);
            });
    }, []);

    const handleDateClick = (selectInfo) => {
        // Define as datas de início e fim antes de mostrar o modal
        setRoomDetails(prev => ({
            ...prev,
            start: selectInfo.dateStr + "T08:00:00Z",
            end: selectInfo.dateStr + "T12:00:00Z"
        }));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError('');
        setSuccess('');
    };

    const submitRoomDetails = async () => {
        setLoading(true); // Ativar o indicador de carregamento

        try {
            // Executar a requisição POST para adicionar a sala
            const roomResponse = await axios.post('http://localhost:5000/api/room/add', roomDetails);
            console.log('Room Added:', roomResponse.data); // Log the room addition for debug

            // Atualize o estado após adicionar a sala
            setEvents(prevEvents => [...prevEvents, {
                ...roomDetails,
                title: `${roomDetails.hospitalName} - Sala ${roomDetails.roomName}`,
                backgroundColor: '#90E3EE'
            }]);
            setSuccess('Disponibilidade da sala adicionada com sucesso.');
        } catch (error) {
            // Lidar com erros
            setError(`Erro: ${error.response?.data || error.message}`);
        } finally {
            setLoading(false); // Desativar o indicador de carregamento
            handleCloseModal(); // Fechar modal independentemente do sucesso ou falha
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
                    <div>
                        <strong>{eventInfo.event._def.title}</strong>
                    </div>
                )}
            />

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Disponibilizar Sala</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome do Hospital</Form.Label>
                            <Form.Control
                                type="text"
                                value={roomDetails.hospitalName}
                                onChange={(e) => setRoomDetails({ ...roomDetails, hospitalName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome da Sala</Form.Label>
                            <Form.Control
                                type="text"
                                value={roomDetails.roomName}
                                onChange={(e) => setRoomDetails({ ...roomDetails, roomName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Horário</Form.Label>
                            <DropdownButton id="dropdown-basic-button" title={dropdownTitle} onSelect={(e) => {
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
