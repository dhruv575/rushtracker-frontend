import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../utils/api';
import RusheeEventForm from '../components/Events/RusheeEventForm';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1`
  color: #2d3748;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: #4a5568;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const OnboardingPrompt = styled.div`
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const OnboardingLink = styled.a`
  color: #2b6cb0;
  text-decoration: underline;
  font-weight: 500;

  &:hover {
    color: #2c5282;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #e53e3e;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
`;


const PublicRusheeForm = () => {
  const { fratId, eventId } = useParams();  // Updated to use IDs from URL
  const [event, setEvent] = useState(null);
  const [fratInfo, setFratInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventAndFratInfo();
  }, []);

  const fetchEventAndFratInfo = useCallback(async () => {
    try {
      if (!fratId || !eventId) {
        setError('Invalid URL parameters');
        return;
      }

      // Fetch fraternity using direct ID
      const fratResponse = await api.get(`/frats/${fratId}`);
      const fratData = fratResponse.data.data;
      setFratInfo(fratData);

      // Fetch event using direct ID
      const eventResponse = await api.get(`/events/${eventId}?fraternity=${fratId}`);
      const eventData = eventResponse.data.data;
      
      // Verify event belongs to fraternity
      if (eventData.fraternity !== fratId) {
        setError('Event does not belong to this fraternity');
        return;
      }

      setEvent(eventData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || 'Failed to load event details');
    }
  });

  if (error) {
    return (
      <Container>
        <ErrorMessage>
          <h2>Oops!</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Return Home
          </button>
        </ErrorMessage>
      </Container>
    );
  }

  if (!event || !fratInfo) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>{fratInfo.name}</Title>
        <Subtitle>{event.name}</Subtitle>
      </Header>

      <OnboardingPrompt>
        <p>
          First time here? Please <OnboardingLink href={`/${fratId}/rush/onboarding`} target="_blank" rel="noopener noreferrer">fill out your basic information</OnboardingLink> before submitting this form.
        </p>
      </OnboardingPrompt>

      <RusheeEventForm 
        event={event}
        fraternity={fratInfo}
        isPublic={true}
      />
    </Container>
  );
};

export default PublicRusheeForm;