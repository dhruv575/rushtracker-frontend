import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import api, { getEventSubmissions } from '../../utils/api';

const PageContainer = styled.div`
  min-height: 30vh;
  border: 1rem solid #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 1rem 0;
  font-size: 2rem;
  text-align: center;
  color: #2d3748;
`;

const Divider = styled.hr`
  margin: 0 1rem 1rem;
  border: none;
  border-top: 2px solid #e2e8f0;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: table;
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.div`
  display: table-row;
  width: 100%;
`;

const TableHeader = styled(TableRow)`
  font-weight: bold;
  background-color: #edf2f7;
`;

const TableCell = styled.div`
  display: table-cell;
  padding: 1rem;
  text-align: left;
  border: 1px solid #e2e8f0;
  white-space: pre-wrap;
  width: ${({ width }) => width || 'auto'};
`;

const Loading = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 1.25rem;
  color: #4a5568;
`;

const Error = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 1.25rem;
  color: #e53e3e;
`;

const BrotherSubmissions = () => {
  const { fratId, eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventAndSubmissions = async () => {
      try {
        // First fetch event details
        const eventResponse = await api.get(`/events/${eventId}?fraternity=${fratId}`);
        const eventData = eventResponse.data.data;
        setEventDetails(eventData);

        // Then fetch submissions
        const submissionsResponse = await api.get(
          `/events/${eventId}/submissions?fraternity=${fratId}&type=brother`
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

  if (loading) return <Loading>Loading...</Loading>;
  if (error) return <Error>{error}</Error>;
  if (!eventDetails) return <Error>No event details found</Error>;

  return (
    <PageContainer>
      <Title>{eventDetails.name} - Brother Submissions</Title>
      <Divider />
      <TableContainer>
        <TableHeader>
          <TableCell width="15%">Brother Name</TableCell>
          {eventDetails.brotherForm.questions.map((q, index) => (
            <TableCell key={index} width={q.questionType === 'textarea' ? '30%' : '15%'}>
              {q.question}
            </TableCell>
          ))}
        </TableHeader>

        {submissions.map((submission, index) => {
          const parsedResponses = JSON.parse(submission.responses || '{}');
          return (
            <TableRow key={index}>
              <TableCell width="15%">{submission.brother?.name || 'Unknown Brother'}</TableCell>
              {eventDetails.brotherForm.questions.map((q, qIndex) => (
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
    </PageContainer>
  );
};

export default BrotherSubmissions;