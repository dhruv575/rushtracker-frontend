import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllRushees, upvoteNote, downvoteNote, removeVote } from '../../utils/api';
import { getBrotherData } from '../../utils/auth';
import Rushee from './Rushee';

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
  gap: 1rem;
  min-width: 300px;
  padding-right: 1rem;
  border-right: 1px solid #eee;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    padding-right: 0;
    padding-bottom: 1.25rem;
    margin-bottom: 1rem;
    min-width: auto;
  }
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #f0f0f0;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    border-radius: 12px;
  }
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

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const RusheeName = styled.div`
  font-weight: 600;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 18px;
    color: #2d3748;
  }
`;

const RusheeEmail = styled.div`
  color: #666;
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 15px;
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
  font-size: 14px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 1.6;
    color: #2d3748;
  }
`;

const NoteMetadata = styled.div`
  color: #666;
  font-size: 12px;

  @media (max-width: 768px) {
    font-size: 13px;
    color: #718096;
  }
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #2d3748;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
    text-align: center;
  }
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
  background: #3182ce;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #2c5282;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 15px;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    margin-top: 0.75rem;
    min-height: 44px;
    
    &:hover {
      transform: none;
    }
  }
`;

const VoteContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 1rem;
    justify-content: center;
  }
`;

const VoteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #4a5568;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 36px;

  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }

  &.active {
    background: ${props => props.$voteType === 'upvote' ? '#e6fffa' : '#fed7d7'};
    border-color: ${props => props.$voteType === 'upvote' ? '#38b2ac' : '#fc8181'};
    color: ${props => props.$voteType === 'upvote' ? '#234e52' : '#742a2a'};
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    min-height: 44px;
  }
`;

const VoteCount = styled.span`
  font-weight: 600;
  margin-left: 0.25rem;
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
      const rushees = response.data.data || [];

      // Collect all notes from all rushees
      const allNotes = rushees.reduce((acc, rushee) => {
        const rusheeNotes = rushee.notes.map((note, noteIndex) => ({
          ...note,
          noteIndex, // Add the note index within the rushee
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

  const handleVote = async (rusheeId, noteIndex, voteType) => {
    try {
      const brother = getBrotherData();
      let response;
      if (voteType === 'upvote') {
        response = await upvoteNote(rusheeId, noteIndex, brother.frat);
      } else if (voteType === 'downvote') {
        response = await downvoteNote(rusheeId, noteIndex, brother.frat);
      } else if (voteType === 'remove') {
        response = await removeVote(rusheeId, noteIndex, brother.frat);
      }

      if (response.data.success) {
        // Refresh the notes list
        fetchNotesFromAllRushees();
      }
    } catch (error) {
      console.error("Failed to vote on note:", error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>Recent Notes</Title>
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

  return (
    <Container>
      <Title>Recent Notes</Title>
      {notes.map((note, index) => {
        const brother = getBrotherData();
        const currentUserVoted = brother._id;
        const hasUpvoted = note.upvotes && note.upvotes.includes(currentUserVoted);
        const hasDownvoted = note.downvotes && note.downvotes.includes(currentUserVoted);
        const upvoteCount = note.upvotes ? note.upvotes.length : 0;
        const downvoteCount = note.downvotes ? note.downvotes.length : 0;
        
        return (
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
              <VoteContainer>
                <VoteButton
                  $voteType="upvote"
                  className={hasUpvoted ? 'active' : ''}
                  onClick={() => handleVote(note.rushee._id, note.noteIndex, hasUpvoted ? 'remove' : 'upvote')}
                >
                  ▲ <VoteCount>{upvoteCount}</VoteCount>
                </VoteButton>
                <VoteButton
                  $voteType="downvote"
                  className={hasDownvoted ? 'active' : ''}
                  onClick={() => handleVote(note.rushee._id, note.noteIndex, hasDownvoted ? 'remove' : 'downvote')}
                >
                  ▼ <VoteCount>{downvoteCount}</VoteCount>
                </VoteButton>
              </VoteContainer>
            </NoteContent>
          </NoteCard>
        );
      })}
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
