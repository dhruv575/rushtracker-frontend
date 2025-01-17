import React, { useState } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';
import api from '../../utils/api';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Instructions = styled.div`
  background-color: #f7fafc;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  margin-bottom: 1rem;
`;

const StepNumber = styled.span`
  background-color: #3182ce;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  margin-right: 0.5rem;
  font-size: 0.875rem;
`;

const PositionList = styled.ul`
  list-style-type: disc;
  margin-left: 2rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
  display: block;

  &:hover {
    background-color: #2c5282;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: inline-block;
  background-color: #4a5568;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2d3748;
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  ${props => props.type === 'success' 
    ? `
      background-color: #c6f6d5;
      color: #276749;
      border: 1px solid #9ae6b4;
    ` 
    : `
      background-color: #fed7d7;
      color: #9b2c2c;
      border: 1px solid #feb2b2;
    `}
`;

const ImportBrothers = () => {
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadTemplate = () => {
    const csvContent = "Name,Email,Position\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Brothers.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const createBrother = async (brotherData) => {
    try {
      await api.post('/brothers', brotherData);
      return true;
    } catch (error) {
      console.error(`Failed to create brother ${brotherData.email}:`, error);
      return false;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setMessage({ type: '', content: '' });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (results.errors.length > 0) {
          setMessage({ 
            type: 'error', 
            content: 'Error parsing CSV file. Please check the format.' 
          });
          setIsProcessing(false);
          return;
        }

        const validPositions = ['President', 'Rush Chair', 'Brother'];
        let successCount = 0;
        let errorCount = 0;

        for (const row of results.data) {
          if (!row.Name || !row.Email || !row.Position) {
            errorCount++;
            continue;
          }

          if (!validPositions.includes(row.Position)) {
            errorCount++;
            continue;
          }

          const success = await createBrother({
            name: row.Name,
            email: row.Email,
            position: row.Position,
          });

          if (success) {
            successCount++;
          } else {
            errorCount++;
          }
        }

        setMessage({
          type: errorCount === 0 ? 'success' : 'error',
          content: `Created ${successCount} brothers successfully. ${
            errorCount > 0 ? `Failed to create ${errorCount} brothers.` : ''
          }`
        });
        setIsProcessing(false);
        
        // Reset file input
        event.target.value = '';
      },
      error: (error) => {
        setMessage({
          type: 'error',
          content: 'Error reading CSV file: ' + error.message
        });
        setIsProcessing(false);
      }
    });
  };

  return (
    <Container>
      <Card>
        <Title>Import Brothers</Title>
        
        <Instructions>
          <Step>
            <StepNumber>1</StepNumber>
            Download the template CSV file below. Open with Excel or Google Drive.
          </Step>
          
          <Step>
            <StepNumber>2</StepNumber>
            Fill in the CSV with brother information. Available positions are:
            <PositionList>
              <li>Rush Chair</li>
              <li>Brother</li>
            </PositionList>
          </Step>
          
          <Step>
            <StepNumber>3</StepNumber>
            Export your file as a CSV and upload it below. Each brother will be created with:
            <ul style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
              <li>The information you provided in the CSV</li>
              <li>Default password: Password123!</li>
            </ul>
          </Step>
        </Instructions>

        <Button onClick={handleDownloadTemplate}>
          Download Template
        </Button>

        <FileLabel>
          Upload Brothers CSV
          <FileInput 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </FileLabel>

        {message.content && (
          <Message type={message.type}>
            {message.content}
          </Message>
        )}
      </Card>
    </Container>
  );
};

export default ImportBrothers;