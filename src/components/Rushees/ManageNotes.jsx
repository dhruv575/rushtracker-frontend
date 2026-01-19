import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllRushees, deleteNote } from '../../utils/api';
import { getBrotherData } from '../../utils/auth';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1rem;
    background: #f7fafc;
  }
`;

const NoteCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    
    &:hover {
      transform: none;
    }
  }
`;

const RusheeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
  border-right: 1px solid #eee;
  padding-right: 1rem;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    min-width: auto;
  }
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

const RusheeDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const RusheeName = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    color: #1a202c;
  }
`;

const RusheeEmail = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #718096;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    color: #4a5568;
  }
`;

const NoteContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const NoteText = styled.p`
  margin: 0;
  line-height: 1.5;
  color: #4a5568;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
    color: #2d3748;
  }
`;

const NoteMetadata = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #718096;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    color: #4a5568;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }

  @media (max-width: 768px) {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 0.8rem 1rem;
    border-radius: 10px;
  }
`;

const DeleteButton = styled.button`
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #c53030;
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    margin-top: 0.5rem;
    min-height: 44px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const ManageNotes = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const brother = getBrotherData();

  useEffect(() => {
    fetchNotesFromAllRushees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [notes, searchTerm]);

  const fetchNotesFromAllRushees = async () => {
    try {
      setLoading(true);
      const response = await getAllRushees({ fraternity: brother.frat });
      const rushees = response.data.data || [];
      
      // Flatten all notes from all rushees with rushee context
      const allNotes = [];
      rushees.forEach(rushee => {
        const rusheeNotes = rushee.notes.map((note, noteIndex) => ({
          ...note,
          noteIndex,
          rushee: {
            _id: rushee._id,
            name: rushee.name,
            email: rushee.email,
            picture: rushee.picture
          }
        }));
        allNotes.push(...rusheeNotes);
      });
      
      // Sort by timestamp (newest first)
      allNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setNotes(allNotes);
      setFilteredNotes(allNotes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteNote = async (rusheeId, noteIndex) => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    const deleteKey = `${rusheeId}-${noteIndex}`;
    setDeleting(prev => ({ ...prev, [deleteKey]: true }));

    try {
      const response = await deleteNote(rusheeId, noteIndex, brother.frat);
      if (response.data.success) {
        // Refresh the notes list
        fetchNotesFromAllRushees();
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      console.error("Error response:", error.response?.data);
      alert('Failed to delete note. Please try again.');
    } finally {
      setDeleting(prev => ({ ...prev, [deleteKey]: false }));
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>Manage Notes</Title>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '1.1rem',
          color: '#718096'
        }}>
          Loading notes...
        </div>
      </Container>
    );
  }

  if (notes.length === 0) {
    return (
      <Container>
        <Title>Manage Notes</Title>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '1.1rem',
          color: '#718096'
        }}>
          No notes found.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Manage Notes</Title>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search notes by content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      {filteredNotes.length === 0 && searchTerm.trim() !== '' ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '1.1rem',
          color: '#718096'
        }}>
          No notes found matching "{searchTerm}".
        </div>
      ) : (
        filteredNotes.map((note, index) => {
        const deleteKey = `${note.rushee._id}-${note.noteIndex}`;
        const isDeleting = deleting[deleteKey];

        return (
          <NoteCard key={`${note.rushee._id}-${note.noteIndex}`}>
            <RusheeInfo>
              <ProfileImage 
                src={note.rushee.picture || '/default.jpg'} 
                alt={note.rushee.name}
                onError={(e) => {
                  e.target.src = '/default.jpg';
                }}
              />
              <RusheeDetails>
                <RusheeName>{note.rushee.name}</RusheeName>
                <RusheeEmail>{note.rushee.email}</RusheeEmail>
              </RusheeDetails>
            </RusheeInfo>
            
            <NoteContent>
              <NoteText>{note.content}</NoteText>
              <NoteMetadata>
                <span>
                  By: {note.author?.name || 'Unknown'} ({note.author?.email || 'No Email'}) 
                  on {new Date(note.timestamp).toLocaleString()}
                </span>
              </NoteMetadata>
            </NoteContent>

            <DeleteButton
              onClick={() => handleDeleteNote(note.rushee._id, note.noteIndex)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </DeleteButton>
          </NoteCard>
        );
      })
      )}
    </Container>
  );
};

export default ManageNotes;
