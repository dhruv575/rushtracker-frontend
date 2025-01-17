// src/pages/PresidentDashboard/index.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { getBrotherData } from '../utils/auth';
import UpdateProfile from '../components/Dashboards/UpdateProfile';
import ImportBrothers from '../components/Dashboards/ImportBrothers';
import DisplayBrotherhood from '../components/Dashboards/DisplalyBrotherhood';
import CreateEvent from '../components/Events/CreateEvent';
import EventList from '../components/Events/EventList.jsx';
import DisplayRushees from '../components/Rushees/RusheesBrother.jsx';

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

const PresidentDashboard = () => {
  const brother = getBrotherData();
  const [activeTab, setActiveTab] = useState('display');

  const renderContent = () => {
    switch (activeTab) {
      case 'update':
        return <UpdateProfile />;
      case 'import':
        return <ImportBrothers />;
      case 'create':
        return <CreateEvent />;
      case 'eventList':
        return <EventList />;
      case 'displayRushees':
        return <DisplayRushees />;
      case 'display':
      default:
        return <DisplayBrotherhood />;
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Welcome, {brother.name}</Title>
        <Subtitle>President Dashboard</Subtitle>
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'display'} 
          onClick={() => setActiveTab('display')}
        >
          Brotherhood
        </Tab>
        <Tab 
          active={activeTab === 'import'} 
          onClick={() => setActiveTab('import')}
        >
          Import Brothers
        </Tab>
        <Tab 
          active={activeTab === 'update'} 
          onClick={() => setActiveTab('update')}
        >
          Update Profile
        </Tab>
        <Tab 
          active={activeTab === 'create'} 
          onClick={() => setActiveTab('create')}
        >
          Create Event
        </Tab>
        <Tab 
          active={activeTab === 'eventList'} 
          onClick={() => setActiveTab('eventList')}
        >
          Event List
        </Tab>
        <Tab 
          active={activeTab === 'displayRushees'} 
          onClick={() => setActiveTab('displayRushees')}
        >
          Rushees
        </Tab>
      </TabContainer>

      <ContentContainer>
        {renderContent()}
      </ContentContainer>
    </DashboardContainer>
  );
};

export default PresidentDashboard;
