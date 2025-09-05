import React from 'react';
import styled from 'styled-components';

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
  const generateCSV = (data) => {
    try {
      // Simple headers for just names and emails
      const headers = ['Name', 'Email'];

      // Extract only name and email from each rushee
      const csvData = data.map(rushee => [
        rushee.name || '',
        rushee.email || ''
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(cell => {
            // Escape quotes and wrap in quotes if contains comma, newline, or quote
            const processedCell = String(cell).replace(/"/g, '""');
            return /[,\n"]/.test(processedCell) 
              ? `"${processedCell}"`
              : processedCell;
          }).join(',')
        )
      ].join('\n');

      // Create and download the file
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