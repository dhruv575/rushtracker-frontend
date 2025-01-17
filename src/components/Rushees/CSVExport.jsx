import React from 'react';
import styled from 'styled-components';
import { getAllEvents } from '../../utils/api';
import { getBrotherData } from '../../utils/auth';

const ExportContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ExportButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 44px;
  font-size: 0.9rem;
  white-space: nowrap;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #2c5282;
  }

  &:active {
    background-color: #2a4365;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.5rem;
  }
`;

const CSVExport = ({ rushees, allRushees }) => {
  const generateCSV = async (data) => {
    try {
      const brother = getBrotherData();
      const eventsResponse = await getAllEvents({ fraternity: brother.frat });
      const events = eventsResponse.data || [];

      const baseHeaders = [
        'Name',
        'Email',
        'Phone',
        'Major',
        'Tags',
        'Year',
        'GPA',
        'Picture',
        'Resume'
      ];

      const eventHeaders = events.map(event => `Event: ${event.name}`);
      const headers = [...baseHeaders, ...eventHeaders, 'Notes'];

      const csvData = data.map(rushee => {
        const basicInfo = [
          rushee.name || '',
          rushee.email || '',
          rushee.phone || '',
          rushee.major || '',
          (rushee.tags || []).join('; '),
          rushee.year || '',
          rushee.gpa || '',
          rushee.picture || '',
          rushee.resume || ''
        ];

        const eventData = events.map(event => {
          const attended = rushee.eventsAttended.some(
            attendedEvent => attendedEvent._id === event._id
          );
          return attended ? 'Attended' : 'Not Attended';
        });

        const notes = (rushee.notes || [])
          .map(note => `${note.content}`)
          .join('\\n'); // Use escaped newline for CSV

        return [...basicInfo, ...eventData, notes];
      });

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(cell => {
            const processedCell = String(cell).replace(/"/g, '""');
            return /[,\n"]/.test(processedCell) 
              ? `"${processedCell}"`
              : processedCell;
          }).join(',')
        )
      ].join('\\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `rushees_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error('Failed to generate CSV:', error);
      alert('Failed to generate CSV. Please try again.');
    }
  };

  return (
    <ExportContainer>
      <ExportButton onClick={() => generateCSV(rushees)}>
        Export Current List
      </ExportButton>
      <ExportButton onClick={() => generateCSV(allRushees)}>
        Export All Rushees
      </ExportButton>
    </ExportContainer>
  );
};

export default CSVExport;