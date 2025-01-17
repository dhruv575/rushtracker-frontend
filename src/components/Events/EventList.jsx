import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { getAllEvents } from '../../utils/api';
import { getBrotherData } from '../../utils/auth';
import BrotherEventForm from './BrotherEventForm';
import api from '../../utils/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const EventCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const EventTitle = styled.h3`
  color: #2d3748;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const EventDetails = styled.div`
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  ${(props) =>
    props.variant === 'primary'
      ? `
    background-color: #3182ce;
    color: white;

    &:hover {
      background-color: #2c5282;
    }
  `
      : `
    background-color: #e2e8f0;
    color: #4a5568;

    &:hover {
      background-color: #cbd5e0;
    }
  `}

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4a5568;

  &:hover {
    color: #2d3748;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Message = styled.div`
  padding: 1rem;
  background-color: #fed7d7;
  color: #9b2c2c;
  border-radius: 4px;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.875rem;
  }
`;


const EventList = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState(null);
  const [fratInfo, setFratInfo] = useState(null);
  const brother = getBrotherData();

  const fetchFratInfo = useCallback(async () => {
    try {
      const response = await api.get(`/frats/${brother.frat}`);
      setFratInfo(response.data.data);
    } catch (error) {
      setError('Failed to load fraternity information');
    }
  }, [brother.frat]);

  useEffect(() => {
    fetchFratInfo();
    fetchEvents();
  }, [fetchFratInfo]);

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      setEvents(response.data);
    } catch (error) {
      setError('Failed to load events');
    }
  };

  const handleOpenForm = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseForm = () => {
    setSelectedEvent(null);
  };

  const getPublicUrl = (event) => {
    if (!fratInfo) return '';
    return `${window.location.origin}/${fratInfo._id}/rush/${event._id}`;
  };

  const getRusheeSubmissionsUrl = (event) => {
    if (!fratInfo) return '';
    return `/${fratInfo._id}/rush/${event._id}/rushee-submissions`;
  };

  const getBrotherSubmissionsUrl = (event) => {
    if (!fratInfo) return '';
    return `/${fratInfo._id}/rush/${event._id}/brother-submissions`;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Container>
      {error && <Message>{error}</Message>}

      {fratInfo &&
        events.map((event) => (
          <EventCard key={event._id}>
            <EventHeader>
              <div>
                <EventTitle>{event.name}</EventTitle>
                <EventDetails>
                  <div>Location: {event.location}</div>
                  <div>Start: {formatDateTime(event.start)}</div>
                  <div>End: {formatDateTime(event.end)}</div>
                </EventDetails>
              </div>
              <ButtonGroup>
                <Button variant="primary" onClick={() => handleOpenForm(event)}>
                  Fill Out Form
                </Button>
                <Button onClick={() => window.open(getPublicUrl(event), '_blank')}>
                  Open Public Form
                </Button>
                <Button onClick={() => window.open(getRusheeSubmissionsUrl(event), '_blank')}>
                  View Rushee Submissions
                </Button>
                <Button onClick={() => window.open(getBrotherSubmissionsUrl(event), '_blank')}>
                  View Brother Submissions
                </Button>
              </ButtonGroup>
            </EventHeader>
          </EventCard>
        ))}

      {selectedEvent && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={handleCloseForm}>&times;</CloseButton>
            <BrotherEventForm eventId={selectedEvent._id} />
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default EventList;
