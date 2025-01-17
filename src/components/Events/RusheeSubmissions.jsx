import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api, { getEventSubmissions, getRusheeById } from '../../utils/api';
import Rushee from '../Rushees/Rushee'; // Import the Rushee component

const PageContainer = styled.div`
  min-height: 30vh;
  border: 1rem solid #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    border: 0.5rem solid #fff;
    padding: 1rem;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3748;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Divider = styled.hr`
  margin: 0 1rem 1rem;
  border: none;
  border-top: 2px solid #e2e8f0;

  @media (max-width: 768px) {
    margin: 0 0.5rem 1rem;
  }
`;

const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: table;
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const TableRow = styled.div`
  display: table-row;
  width: 100%;
`;

const TableHeader = styled(TableRow)`
  font-weight: bold;
  background-color: #edf2f7;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const TableCell = styled.div`
  display: table-cell;
  padding: 1rem;
  text-align: left;
  border: 1px solid #e2e8f0;
  white-space: pre-wrap;
  width: ${({ width }) => width || 'auto'};

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background-color: #2c5282;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
`;

const ExportButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  height: fit-content;

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
`;

const Loading = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 1.25rem;
  color: #4a5568;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

const Error = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 1.25rem;
  color: #e53e3e;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: 1rem;
  }
`;

const ModalOverlay = styled.div`
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
  padding: 2rem;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
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
  font-weight: bold;
  color: #e53e3e;
  cursor: pointer;

  &:hover {
    color: #c53030;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;


const RusheeSubmissions = () => {
  const { fratId, eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRusheeId, setSelectedRusheeId] = useState(null);

  useEffect(() => {
    const fetchEventAndSubmissions = async () => {
      try {
        // First fetch event details
        const eventResponse = await api.get(`/events/${eventId}?fraternity=${fratId}`);
        const eventData = eventResponse.data.data;
        setEventDetails(eventData);

        // Then fetch submissions
        const submissionsResponse = await api.get(
          `/events/${eventId}/submissions?fraternity=${fratId}&type=rushee`
        );
        setSubmissions(submissionsResponse.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.error || 'Failed to load event details or submissions');
        setLoading(false);
      }
    };

    if (fratId && eventId) {
      fetchEventAndSubmissions();
    }
  }, [fratId, eventId]);

  const closeModal = () => {
    setSelectedRusheeId(null);
  };

  const handleExportCSV = () => {
    if (!eventDetails || !submissions.length) return;

    // Prepare the headers (excluding Actions column)
    const headers = eventDetails.rusheeForm.questions.map(q => q.question);
    
    // Prepare the rows
    const rows = submissions.map(submission => {
      const parsedResponses = JSON.parse(submission.responses || '{}');
      return eventDetails.rusheeForm.questions.map((_, index) => {
        const response = parsedResponses[index];
        // Handle array responses (like checkbox questions)
        if (Array.isArray(response)) {
          return response.join(', ');
        }
        return response || '';
      });
    });

    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => {
          // Escape quotes and wrap in quotes if necessary
          const escapedCell = cell.toString().replace(/"/g, '""');
          return /[,"\n]/.test(escapedCell) ? `"${escapedCell}"` : escapedCell;
        }).join(',')
      )
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${eventDetails.name}_rushee_submissions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Error>{error}</Error>;
  if (!eventDetails) return <Error>No event details found</Error>;

  return (
    <PageContainer>
      <TitleContainer>
        <Title>{eventDetails.name} - Rushee Submissions</Title>
        <ExportButton onClick={handleExportCSV}>
          Export CSV
        </ExportButton>
      </TitleContainer>
      <Divider />
      <TableContainer>
        <TableHeader>
          <TableCell width="15%">Actions</TableCell>
          {eventDetails.rusheeForm.questions.map((q, index) => (
            <TableCell key={index} width={q.questionType === 'textarea' ? '30%' : '15%'}>
              {q.question}
            </TableCell>
          ))}
        </TableHeader>

        {submissions.map((submission, index) => {
          const parsedResponses = JSON.parse(submission.responses || '{}');
          return (
            <TableRow key={index}>
              <TableCell width="15%">
                <Button onClick={() => setSelectedRusheeId(submission.rushee?._id)}>
                  View Rushee
                </Button>
              </TableCell>
              {eventDetails.rusheeForm.questions.map((q, qIndex) => (
                <TableCell key={qIndex} width={q.questionType === 'textarea' ? '30%' : '15%'}>
                  {Array.isArray(parsedResponses[qIndex])
                    ? parsedResponses[qIndex].join(', ')
                    : parsedResponses[qIndex] || 'No Response'}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableContainer>

      {selectedRusheeId && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={closeModal}>&times;</CloseButton>
            <Rushee rusheeId={selectedRusheeId} />
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default RusheeSubmissions;

