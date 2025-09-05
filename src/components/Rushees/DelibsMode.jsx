import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllRushees, addRusheeNote } from '../../utils/api';
import { getBrotherData } from '../../utils/auth';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f8f8;
`;

const RusheeSlide = styled.div`
  border: 1px solid #8b0000;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: white;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  max-height: ${props => props.isMinimized ? '40px' : '600px'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SlideHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: linear-gradient(to right, #8b0000, #6b0000);
  cursor: pointer;
  height: 40px;
  color: #ffd700;
  font-weight: bold;

  &:hover {
    background: linear-gradient(to right, #6b0000, #4b0000);
  }
`;

const MinimizeIcon = styled.span`
  color: #ffd700;
  font-size: 1.2rem;
  transform: ${props => props.isMinimized ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s ease;
`;

const SlideContent = styled.div`
  display: flex;
  height: 560px;
`;

const LeftPanel = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
  padding-bottom: 1rem;
`;

const ProfileSection = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
`;

const ProfileImage = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid #8b0000;
`;

const RusheeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RusheeInfo = styled.div`
  flex: 1;
`;

const InfoItem = styled.div`
  margin-bottom: 0.5rem;
  padding: 0.3rem;
  border-radius: 4px;
  background-color: ${props => props.index % 2 === 0 ? '#fff' : '#fff9e6'};
`;

const Label = styled.span`
  font-weight: bold;
  color: #8b0000;
`;

const AddNoteSection = styled.div`
  padding: 1.5rem;
  margin-top: auto;
  border-top: 1px solid #e2e8f0;
  background-color: #fff;
  margin-right: 1rem;
`;

const NotesPanel = styled.div`
  width: 50%;
  padding: 1rem;
  overflow-y: auto;
  background-color: #fff;
`;

const NoteInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #8b0000;
  border-radius: 4px;
  min-height: 100px;
  margin: 1rem 0;
  background-color: #fff;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 1px #ffd700;
  }
`;

const Button = styled.button`
  background-color: #8b0000;
  color: #ffd700;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #6b0000;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const AnonymousToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: #fff;
  border-radius: 4px;
`;

const Checkbox = styled.input`
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  color: #4a5568;
  cursor: pointer;
`;

const Note = styled.div`
  margin-bottom: 1rem;
  padding: 0.8rem;
  border-radius: 4px;
  background-color: #fff9e6;
  border-left: 3px solid #8b0000;
`;

const NoteMetadata = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
`;

const DelibsMode = () => {
  const [rushees, setRushees] = useState([]);
  const [minimizedSlides, setMinimizedSlides] = useState(new Set());
  const [noteInputs, setNoteInputs] = useState({});
  const brother = getBrotherData();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchRushees();
  }, []);

  const fetchRushees = async () => {
    try {
      const response = await getAllRushees({ fraternity: brother.frat });
      setRushees(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch rushees:', error);
    }
  };

  const toggleMinimize = (rusheeId) => {
    setMinimizedSlides(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rusheeId)) {
        newSet.delete(rusheeId);
      } else {
        newSet.add(rusheeId);
      }
      return newSet;
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleNoteChange = (rusheeId, value) => {
    setNoteInputs(prev => ({
      ...prev,
      [rusheeId]: value
    }));
  };

  const handleAddNote = async (rusheeId) => {
    const noteContent = noteInputs[rusheeId];
    if (!noteContent?.trim()) return;

    setLoading(true);
    try {
      await addRusheeNote(rusheeId, noteContent, brother.frat, isAnonymous, brother.name);
      
      // Fetch updated rushee data
      const response = await getAllRushees({ fraternity: brother.frat });
      setRushees(response.data.data || []);
      
      // Clear the note input for this specific rushee
      setNoteInputs(prev => ({
        ...prev,
        [rusheeId]: ''
      }));
      setIsAnonymous(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYearDisplay = (year) => {
    switch (year) {
      case '1':
      case 1:
        return 'Freshman';
      case '2':
      case 2:
        return 'Sophomore';
      default:
        return 'N/A';
    }
  };

  return (
    <Container>
      {rushees.map(rushee => (
        <RusheeSlide 
          key={rushee._id} 
          isMinimized={minimizedSlides.has(rushee._id)}
        >
          <SlideHeader onClick={() => toggleMinimize(rushee._id)}>
            <span>{rushee.name}</span>
            <MinimizeIcon isMinimized={minimizedSlides.has(rushee._id)}>
              ▼
            </MinimizeIcon>
          </SlideHeader>
          
          {!minimizedSlides.has(rushee._id) && (
            <SlideContent>
              <LeftPanel>
                <ProfileSection>
                  <ProfileImage>
                    <RusheeImage 
                      src={rushee.picture || '/default.jpg'} 
                      alt={rushee.name}
                      onError={(e) => {
                        e.target.src = '/default.jpg';
                      }}
                    />
                  </ProfileImage>
                  
                  <RusheeInfo>
                    {[
                      { label: 'Email', value: rushee.email },
                      { label: 'Phone', value: rushee.phone || 'N/A' },
                      { label: 'Major', value: rushee.major || 'N/A' },
                      { label: 'Year', value: getYearDisplay(rushee.year) },
                      { label: 'GPA', value: rushee.gpa || 'N/A' },
                      { label: 'Status', value: rushee.status }
                    ].map((item, index) => (
                      <InfoItem key={item.label}>
                        <Label>{item.label}:</Label> {item.value}
                      </InfoItem>
                    ))}
                  </RusheeInfo>
                </ProfileSection>

                <AddNoteSection>
                  <AnonymousToggle>
                    <Checkbox
                      type="checkbox"
                      id={`anonymous-${rushee._id}`}
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    <CheckboxLabel htmlFor={`anonymous-${rushee._id}`}>
                      Post Anonymously
                    </CheckboxLabel>
                  </AnonymousToggle>
                  <NoteInput
                    placeholder="Add a note..."
                    value={noteInputs[rushee._id] || ''}
                    onChange={(e) => handleNoteChange(rushee._id, e.target.value)}
                  />
                  <Button 
                    onClick={() => handleAddNote(rushee._id)} 
                    disabled={loading || !noteInputs[rushee._id]?.trim()}
                  >
                    {loading ? "Adding..." : "Add Note"}
                  </Button>
                </AddNoteSection>
              </LeftPanel>

              <NotesPanel>
                {rushee.notes.map((note, index) => (
                  <Note key={index}>
                    <div>{note.content}</div>
                    <NoteMetadata>
                      By: {note.author?.name || 'Unknown'} ({note.author?.email || 'No Email'}) 
                      on {formatTimestamp(note.timestamp)}
                    </NoteMetadata>
                  </Note>
                ))}
              </NotesPanel>
            </SlideContent>
          )}
        </RusheeSlide>
      ))}
    </Container>
  );
};

export default DelibsMode;
