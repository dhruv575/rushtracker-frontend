import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';

const ExportButton = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  max-width: fit-content;
  white-space: nowrap;

  &:hover {
    background-color: #2c5282;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.4rem 0.8rem;
  }
`;


const BrotherExport = ({ brothers }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleExportAttendance = () => {
    if (!brothers.length || !events.length) return;

    // Prepare headers
    const headers = ['Name', 'Email', ...events.map(event => event.name)];

    // Prepare rows
    const rows = brothers.map(brother => {
      // Start with basic info
      const row = [
        brother.name,
        brother.email
      ];

      // Add attendance for each event
      events.forEach(event => {
        const hasAttended = brother.eventsAttended?.some(
          attendedEvent => attendedEvent === event._id || attendedEvent?._id === event._id
        );
        row.push(hasAttended ? 'Attended' : 'Not Attended');
      });

      return row;
    });

    // Convert to CSV format
    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => {
          // Escape special characters and wrap in quotes if needed
          const escapedCell = cell.toString().replace(/"/g, '""');
          return /[,"\n]/.test(escapedCell) ? `"${escapedCell}"` : escapedCell;
        }).join(',')
      )
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `brotherhood_attendance_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <ExportButton onClick={handleExportAttendance}>
      Export Attendance
    </ExportButton>
  );
};

export default BrotherExport;