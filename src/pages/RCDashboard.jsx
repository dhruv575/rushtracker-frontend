// src/pages/RCDashboard/index.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { getBrotherData } from '../utils/auth';
import CreateEvent from '../components/Events/CreateEvent';
import EventList from '../components/Events/EventList';
import UpdateProfile from '../components/Dashboards/UpdateProfile';
import DisplayRushees from '../components/Rushees/DisplayRushees';
import NotesLog from '../components/Rushees/NotesLog';

const DashboardContainer = styled.div`
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
  margin-bottom: 0.5rem;
  color: #2d3748;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: #4a5568;
  margin-top: 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
    border-bottom: none;
  }
`;

const Tab = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => (props.active ? '#3182ce' : 'transparent')};
  color: ${props => (props.active ? '#3182ce' : '#4a5568')};
  font-size: 1rem;
  font-weight: ${props => (props.active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #3182ce;
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    text-align: left;
    border-left: 3px solid ${props => (props.active ? '#3182ce' : 'transparent')};
    border-bottom: none;
  }
`;

const ContentContainer = styled.div`
  margin-top: 2rem;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;


const RCDashboard = () => {
  const brother = getBrotherData();
  const [activeTab, setActiveTab] = useState('events');

  const renderContent = () => {
    switch (activeTab) {
      case 'create':
        return <CreateEvent />;
      case 'update':
        return <UpdateProfile />;
      case 'displayRushees':
        return <DisplayRushees />;
      case 'notesLog':
        return <NotesLog />;
      case 'events':
      default:
        return <EventList />;
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Welcome, {brother.name}</Title>
        <Subtitle>Rush Chair Dashboard</Subtitle>
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'events'} 
          onClick={() => setActiveTab('events')}
        >
          Events
        </Tab>
        <Tab 
          active={activeTab === 'create'} 
          onClick={() => setActiveTab('create')}
        >
          Create Event
        </Tab>
        <Tab 
          active={activeTab === 'update'} 
          onClick={() => setActiveTab('update')}
        >
          Update Profile
        </Tab>
        <Tab 
          active={activeTab === 'displayRushees'} 
          onClick={() => setActiveTab('displayRushees')}
        >
          Display Rushees
        </Tab>
        <Tab 
          active={activeTab === 'notesLog'} 
          onClick={() => setActiveTab('notesLog')}
        >
          Notes Log
        </Tab>
      </TabContainer>

      <ContentContainer>
        {renderContent()}
      </ContentContainer>
    </DashboardContainer>
  );
};

export default RCDashboard;