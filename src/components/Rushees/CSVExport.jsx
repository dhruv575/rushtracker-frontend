import React from 'react';
import styled from 'styled-components';
import { getAllEvents } from '../../utils/api';
import { getBrotherData } from '../../utils/auth';

const ExportContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: auto;
  width: 40%;
`;

const ExportButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: #2c5282;
  }
`;

const CSVExport = ({ rushees }) => {
  const generateCSV = async (data) => {
    try {
      // Fetch all events for the fraternity to ensure we have complete event data
      const brother = getBrotherData();
      const eventsResponse = await getAllEvents({ fraternity: brother.frat });
      const events = eventsResponse.data || [];

      // Prepare headers
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

      // Add event headers
      const eventHeaders = events.map(event => `Event: ${event.name}`);
      
      // Combine all headers
      const headers = [...baseHeaders, ...eventHeaders, 'Notes'];

      // Process rushee data
      const csvData = data.map(rushee => {
        // Process basic info
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

        // Process events
        const eventData = events.map(event => {
          const attended = rushee.eventsAttended.some(
            attendedEvent => attendedEvent._id === event._id
          );
          return attended ? 'Attended' : 'Not Attended';
        });

        // Process notes
        const notes = (rushee.notes || [])
          .map(note => `${note.content}`)
          .join('\n');

        // Combine all data
        return [...basicInfo, ...eventData, notes];
      });

      // Convert to CSV string
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(cell => {
            // Escape special characters and wrap in quotes if needed
            const processedCell = cell.toString().replace(/"/g, '""');
            return /[,\n"]/.test(processedCell) 
              ? `"${processedCell}"`
              : processedCell;
          }).join(',')
        )
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `rushees_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      <ExportButton onClick={() => generateCSV(rushees)}>
        Export All Rushees
      </ExportButton>
    </ExportContainer>
  );
};

export default CSVExport;