import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllRushees } from '../../utils/api';
import { getBrotherData } from '../../utils/auth';
import Rushee from './Rushee';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const NoteCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: white;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RusheeInfo = styled.div`
  display: flex;
  gap: 1rem;
  min-width: 300px;
  padding-right: 1rem;
  border-right: 1px solid #eee;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-right: 0;
    padding-bottom: 1rem;
  }
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f0f0f0;
`;

const RusheeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RusheeDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RusheeName = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const RusheeEmail = styled.div`
  color: #666;
  font-size: 14px;
`;

const NoteContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NoteText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const NoteMetadata = styled.div`
  color: #666;
  font-size: 12px;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #2d3748;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const Button = styled.button`
  background: blue;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  border-radius: 5px;

  &:hover {
    color: #000;
  }
`;

const NotesLog = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRushee, setSelectedRushee] = useState(null);

  useEffect(() => {
    fetchNotesFromAllRushees();
  }, []);

  const fetchNotesFromAllRushees = async () => {
    try {
      const brother = getBrotherData();
      const response = await getAllRushees({ fraternity: brother.frat });
      const rushees = response.data || [];

      // Collect all notes from all rushees
      const allNotes = rushees.reduce((acc, rushee) => {
        const rusheeNotes = rushee.notes.map(note => ({
          ...note,
          rushee: {
            _id: rushee._id,
            name: rushee.name,
            email: rushee.email,
            picture: rushee.picture
          }
        }));
        return [...acc, ...rusheeNotes];
      }, []);

      // Sort notes by timestamp (most recent first)
      const sortedNotes = allNotes.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      setNotes(sortedNotes);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) return <Container>Loading...</Container>;

  return (
    <Container>
      <Title>Recent Notes</Title>
      {notes.map((note, index) => (
        <NoteCard key={`${note.rushee._id}-${index}`}>
          <RusheeInfo>
            <ProfileImage>
              {note.rushee.picture ? (
                <RusheeImage 
                  src={note.rushee.picture} 
                  alt={note.rushee.name}
                  onError={(e) => {
                    e.target.src = '/default.jpg';
                  }}
                />
              ) : (
                <RusheeImage 
                  src="/default.jpg" 
                  alt="Default profile"
                />
              )}
            </ProfileImage>
            <RusheeDetails>
              <RusheeName>{note.rushee.name}</RusheeName>
              <RusheeEmail>{note.rushee.email}</RusheeEmail>
              <Button onClick={() => setSelectedRushee(note.rushee)}>
                View Rushee
              </Button>
            </RusheeDetails>
          </RusheeInfo>
          <NoteContent>
            <NoteText>{note.content}</NoteText>
            <NoteMetadata>
              By: {note.author.name} ({note.author.email}) on {formatTimestamp(note.timestamp)}
            </NoteMetadata>
          </NoteContent>
        </NoteCard>
      ))}
      {selectedRushee && (
        <>
          <Overlay onClick={() => setSelectedRushee(null)} />
          <Modal>
            <CloseButton onClick={() => setSelectedRushee(null)}>&times;</CloseButton>
            <Rushee rusheeId={selectedRushee._id} />
          </Modal>
        </>
      )}
    </Container>
  );
};

export default NotesLog;
