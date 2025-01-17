import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';
import { getBrotherData } from '../../utils/auth';
import BrotherExport from './BrotherExport';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const FilterContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  color: #4a5568;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BrotherCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Name = styled.h3`
  font-size: 1.25rem;
  color: #2d3748;
  margin: 0;
`;

const Email = styled.p`
  color: #4a5568;
  margin: 0;
`;

const Position = styled.p`
  color: #2b6cb0;
  font-weight: 500;
  margin: 0;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${props => props.active ? '#C6F6D5' : '#FED7D7'};
  color: ${props => props.active ? '#276749' : '#9B2C2C'};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;

  &:hover {
    background-color: #2c5282;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
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

const DisplayBrotherhood = () => {
  const [brothers, setBrothers] = useState([]);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [editingBrother, setEditingBrother] = useState(null);
  const [showAllBrothers, setShowAllBrothers] = useState(false);
  const currentBrother = getBrotherData();
  const isPresident = currentBrother?.position === 'President';

  const positions = ['President', 'Rush Chair', 'Brother'];

  useEffect(() => {
    fetchBrothers();
  }, []);

  const fetchBrothers = async () => {
    try {
      const response = await api.get('/brothers');
      setBrothers(response.data.data);
    } catch (error) {
      setMessage({
        type: 'error',
        content: 'Failed to fetch brotherhood data'
      });
    }
  };

  const handleUpdatePosition = async (brotherId, newPosition) => {
    try {
      await api.patch(`/brothers/${brotherId}/position`, {
        position: newPosition
      });
      
      setMessage({
        type: 'success',
        content: 'Position updated successfully'
      });
      
      fetchBrothers();
      setEditingBrother(null);
    } catch (error) {
      setMessage({
        type: 'error',
        content: error.response?.data?.error || 'Failed to update position'
      });
    }
  };

  const handleToggleActive = async (brotherId, currentStatus) => {
    try {
      await api.patch(`/brothers/${brotherId}/toggle-active`);
      
      setMessage({
        type: 'success',
        content: `Brother ${currentStatus ? 'deactivated' : 'activated'} successfully`
      });
      
      fetchBrothers();
    } catch (error) {
      setMessage({
        type: 'error',
        content: error.response?.data?.error || 'Failed to update status'
      });
    }
  };

  const filteredBrothers = showAllBrothers 
    ? brothers 
    : brothers.filter(brother => brother.isActive);

  return (
    <Container>
      {message.content && (
        <Message type={message.type}>
          {message.content}
        </Message>
      )}
      <FilterContainer>
        <BrotherExport brothers={filteredBrothers} />
        <Checkbox
          type="checkbox"
          id="showAll"
          checked={showAllBrothers}
          onChange={(e) => setShowAllBrothers(e.target.checked)}
        />
        <CheckboxLabel htmlFor="showAll">
          Show {showAllBrothers ? 'only active' : 'all'} brothers
        </CheckboxLabel>
      </FilterContainer>

      <Grid>
        {filteredBrothers.map(brother => (
          <BrotherCard key={brother._id}>
            <Name>{brother.name}</Name>
            <Email>{brother.email}</Email>
            <Position>{brother.position}</Position>
            <StatusBadge active={brother.isActive}>
              {brother.isActive ? 'Active' : 'Inactive'}
            </StatusBadge>
            
            {isPresident && editingBrother === brother._id ? (
              <>
                <Select
                  defaultValue={brother.position}
                  onChange={(e) => handleUpdatePosition(brother._id, e.target.value)}
                >
                  {positions.map(position => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </Select>
                <Button onClick={() => setEditingBrother(null)}>
                  Cancel
                </Button>
              </>
            ) : isPresident && (
              <ButtonContainer>
                <Button onClick={() => setEditingBrother(brother._id)}>
                  Update Position
                </Button>
                <Button 
                  onClick={() => handleToggleActive(brother._id, brother.isActive)}
                  style={{
                    backgroundColor: brother.isActive ? '#E53E3E' : '#48BB78'
                  }}
                >
                  {brother.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </ButtonContainer>
            )}
          </BrotherCard>
        ))}
      </Grid>
    </Container>
  );
};

export default DisplayBrotherhood;