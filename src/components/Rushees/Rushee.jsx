import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getRusheeById, updateRusheeStatus, addRusheeNote, updateRushee, addRusheeTag, removeRusheeTag, getFraternity, upvoteNote, downvoteNote, removeVote } from '../../utils/api';
import { getBrotherData } from '../../utils/auth';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0;
    border-radius: 0;
    max-width: 100%;
    min-height: 100vh;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Divider = styled.hr`
  margin: 1rem 0rem;
  border: none;
  border-top: 2px solid #000000;
`;

const Title = styled.h1`
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #4a5568;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
`;

const StatusSelect = styled.select`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 16px; /* Prevents zoom on iOS */
    min-height: 44px; /* Minimum touch target size */
  }
`;

const NoteInput = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  min-height: 100px;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 16px; /* Prevents zoom on iOS */
    min-height: 120px;
  }
`;

const Button = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #2c5282;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 16px;
    min-height: 44px; /* Minimum touch target size */
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    border: 1px solid #e2e8f0;
    padding: 0.5rem;
    text-align: left;
  }

  th {
    background-color: #f7fafc;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    
    th,
    td {
      padding: 0.75rem 0.5rem;
      word-break: break-word;
    }
  }
`;

const EventSubmissionTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;

  th,
  td {
    text-align: left;
    border-bottom: 1px solid #ddd;
    padding: 0.5rem;
    word-break: break-word;
  }

  th {
    background-color: #f7fafc;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    
    th,
    td {
      padding: 0.75rem 0.5rem;
    }
  }
`;

const ProfileField = styled.div`
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 16px; /* Prevents zoom on iOS */
    min-height: 44px; /* Minimum touch target size */
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 16px; /* Prevents zoom on iOS */
    min-height: 44px; /* Minimum touch target size */
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    margin-bottom: 16px;
  }
`;

const ProfileImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const RusheeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProfileInfo = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    
    h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    p {
      font-size: 1rem;
      color: #666;
    }
  }
`;

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleString(); // Adjust options for desired format
};

const NoteInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const AnonymousToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
`;

const Checkbox = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const CheckboxLabel = styled.label`
  color: #4a5568;
  cursor: pointer;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const Tag = styled.span`
  background: #3182ce;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.2s ease;

  &:hover {
    background: #2c5282;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    min-height: 44px; /* Minimum touch target size */
  }
`;

const TagInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const NoteItem = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #3182ce;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding: 1.25rem;
  }
`;

const NoteContent = styled.p`
  margin: 0 0 0.5rem 0;
  line-height: 1.5;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
`;

const NoteMeta = styled.small`
  color: #666;
  font-size: 0.85rem;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 0.9rem;
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

const Rushee = ({ rusheeId }) => {
  const [rushee, setRushee] = useState(null);
  const [fraternityTags, setFraternityTags] = useState([]);
  const [status, setStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const brother = getBrotherData();

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await addRusheeTag(rushee._id, newTag);
      setTags((prev) => [...prev, newTag]);
      setNewTag('');
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  const handleRemoveTag = async (tag) => {
    try {
      await removeRusheeTag(rushee._id, tag);
      setTags((prev) => prev.filter((t) => t !== tag));
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };

  const fetchRusheeDetails = async () => {
    try {
      const response = await getRusheeById(rusheeId, brother.frat);
      setRushee(response.data.data);
      setStatus(response.data.data.status);

      setTags(response.data.data.tags || []);

      if (response.data.data.fraternity) {
        const fratResponse = await getFraternity(response.data.data.fraternity);
        setFraternityTags(fratResponse.data.tags || []);
      } else {
        console.warn('Fraternity ID not available in rushee data');
        setFraternityTags([]);
      }
    } catch (error) {
      console.error('Failed to fetch rushee details:', error);
    }
  };

  useEffect(() => {
    fetchRusheeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rusheeId]);



  const handleStatusChange = async (e) => {
    const selectedStatus = e.target.value;

    try {
      await updateRusheeStatus(rushee._id, selectedStatus, brother.frat);
      setRushee((prev) => ({
        ...prev,
        status: selectedStatus,
      }));
      setStatus(selectedStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await addRusheeNote(rushee._id, newNote, brother.frat, isAnonymous, brother.name);

      const updatedRushee = await getRusheeById(rushee._id, brother.frat);
      setRushee(updatedRushee.data.data);
      setNewNote('');
      setIsAnonymous(false); // Reset anonymous toggle after adding note
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleVote = async (noteIndex, voteType) => {
    try {
      let response;
      if (voteType === 'upvote') {
        response = await upvoteNote(rushee._id, noteIndex, brother.frat);
      } else if (voteType === 'downvote') {
        response = await downvoteNote(rushee._id, noteIndex, brother.frat);
      } else if (voteType === 'remove') {
        response = await removeVote(rushee._id, noteIndex, brother.frat);
      }

      if (response.data.success) {
        setRushee(response.data.data);
      }
    } catch (error) {
      console.error("Failed to vote on note:", error);
      console.error("Error response:", error.response?.data);
    }
  };

  if (!rushee) return <Container>Loading...</Container>;

  return (
    <Container>
      <ProfileHeader>
        <ProfileImage>
          {rushee?.picture ? (
            <RusheeImage 
              src={rushee.picture} 
              alt={rushee.name}
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
        
        <ProfileInfo>
          <h2>{rushee?.name}</h2>
          <p>{rushee?.email}</p>
        </ProfileInfo>
      </ProfileHeader>

      <Section>
        <Label>Status</Label>
        <StatusSelect value={status} onChange={handleStatusChange}>
          <option value="Potential">Potential</option>
          <option value="Active">Active</option>
          <option value="Dropped">Dropped</option>
          <option value="Rejected">Rejected</option>
        </StatusSelect>
      </Section>
      <Section>
        <Label>Tags</Label>
        <TagsContainer>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <Tag
                key={index}
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} &times;
              </Tag>
            ))
          ) : (
            <p>No tags available.</p>
          )}
        </TagsContainer>
        <TagInputContainer>
          <Select
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          >
            <option value="">Select a tag</option>
            {fraternityTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Select>
          <Button onClick={handleAddTag} disabled={!newTag}>
            Add Tag
          </Button>
        </TagInputContainer>
      </Section>
      <Divider />
      <Section>
        <Label>Profile Information</Label>
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            await updateRushee(rushee._id, {
              phone: rushee.phone,
              major: rushee.major,
              year: rushee.year,
              gpa: rushee.gpa,
              resume: rushee.resume,
              picture: rushee.picture
            }, brother.frat);
            // Refresh rushee data
            fetchRusheeDetails();
          } catch (error) {
            console.error("Failed to update profile:", error);
          }
        }}>
          <ProfileField>
            <Label>Phone</Label>
            <Input
              type="tel"
              value={rushee.phone || ''}
              onChange={(e) => setRushee({...rushee, phone: e.target.value})}
              placeholder="Phone number"
            />
          </ProfileField>
          
          <ProfileField>
            <Label>Major</Label>
            <Input
              type="text"
              value={rushee.major || ''}
              onChange={(e) => setRushee({...rushee, major: e.target.value})}
              placeholder="Major"
            />
          </ProfileField>
          
          <ProfileField>
            <Label>Year</Label>
            <StatusSelect
              value={rushee.year || ''}
              onChange={(e) => setRushee({...rushee, year: e.target.value})}
            >
              <option value="">Select Year</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </StatusSelect>
          </ProfileField>
          
          <ProfileField>
            <Label>GPA</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={rushee.gpa || ''}
              onChange={(e) => setRushee({...rushee, gpa: e.target.value})}
              placeholder="GPA"
            />
          </ProfileField>
          
          <ProfileField>
            <Label>Resume Link</Label>
            <Input
              type="url"
              value={rushee.resume || ''}
              onChange={(e) => setRushee({...rushee, resume: e.target.value})}
              placeholder="Resume URL"
            />
          </ProfileField>
          
          <ProfileField>
            <Label>Profile Picture Link</Label>
            <Input
              type="url"
              value={rushee.picture || ''}
              onChange={(e) => setRushee({...rushee, picture: e.target.value})}
              placeholder="Profile picture URL"
            />
          </ProfileField>

          <Button type="submit">Update Profile</Button>
        </form>
      </Section>
      <Divider />
      
      <Section>
        <Label>Notes</Label>
        {rushee.notes.length > 0 ? (
          rushee.notes.map((note, index) => {
            const currentUserVoted = brother._id;
            const hasUpvoted = note.upvotes && note.upvotes.includes(currentUserVoted);
            const hasDownvoted = note.downvotes && note.downvotes.includes(currentUserVoted);
            const upvoteCount = note.upvotes ? note.upvotes.length : 0;
            const downvoteCount = note.downvotes ? note.downvotes.length : 0;
            
            return (
              <NoteItem key={note._id || index}>
                <NoteContent>{note.content}</NoteContent>
                <NoteMeta>
                  By: {note.author?.name || "Unknown Author"} (
                  {note.author?.email || "No Email"}) on{" "}
                  {formatTimestamp(note.timestamp)}
                </NoteMeta>
                <VoteContainer>
                  <VoteButton
                    $voteType="upvote"
                    className={hasUpvoted ? 'active' : ''}
                    onClick={() => handleVote(index, hasUpvoted ? 'remove' : 'upvote')}
                  >
                    ▲ <VoteCount>{upvoteCount}</VoteCount>
                  </VoteButton>
                  <VoteButton
                    $voteType="downvote"
                    className={hasDownvoted ? 'active' : ''}
                    onClick={() => handleVote(index, hasDownvoted ? 'remove' : 'downvote')}
                  >
                    ▼ <VoteCount>{downvoteCount}</VoteCount>
                  </VoteButton>
                </VoteContainer>
              </NoteItem>
            );
          })
        ) : (
          <p>No notes available.</p>
        )}
        <NoteInputContainer>
          <AnonymousToggle>
            <Checkbox
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <CheckboxLabel htmlFor="anonymous">
              Post Anonymously
            </CheckboxLabel>
          </AnonymousToggle>
          <NoteInput
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
          />
          <Button onClick={handleAddNote}>
            Add Note
          </Button>
        </NoteInputContainer>
      </Section>
      <Divider />
      <Section>
        <Label>Event Submissions</Label>
        {rushee.eventsAttended.length > 0 ? (
            rushee.eventsAttended.map((event) => (
            <div key={event._id} style={{ marginBottom: '2rem' }}>
                <h4>{event.name} - {new Date(event.start).toLocaleDateString()}</h4>
                {event.rusheeSubmissions && event.rusheeSubmissions.length > 0 ? (
                event.rusheeSubmissions
                    .filter((submission) => submission.rushee?._id === rushee._id) // Only include submissions for this rushee
                    .map((submission, subIndex) => {
                    const parsedResponses = JSON.parse(submission.responses || '{}'); // Parse the responses JSON
                    return (
                        <div key={subIndex} style={{ marginBottom: '1rem' }}>
                        <p><strong>Submitted by:</strong> {submission.rushee?.name || 'Unknown'} ({submission.rushee?.email || 'No Email'})</p>
                        <EventSubmissionTable>
                            <thead>
                            <tr>
                                <th>Question</th>
                                <th>Answer</th>
                            </tr>
                            </thead>
                            <tbody>
                            {event.rusheeForm.questions.map((question, qIndex) => (
                                <tr key={qIndex}>
                                <td>{question.question}</td>
                                <td>
                                    {parsedResponses[qIndex] || 'No Response'}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </EventSubmissionTable>
                        </div>
                    );
                    })
                ) : (
                <p>No submissions available for this event.</p>
                )}
            </div>
            ))
        ) : (
            <p>No events attended.</p>
        )}
      </Section>
      <Divider />
      <Section>
        <Label>Vouches</Label>
        {rushee.vouches.length > 0 ? (
          rushee.vouches.map((vouch) => {
            console.log("Processing vouch:", vouch);
            return (
              <li key={vouch._id}>
                {vouch.comment} - <em>By {vouch.brother.name}</em>
              </li>
            );
          })
        ) : (
          <p>No vouches available.</p>
        )}
      </Section>
    </Container>
  );
};

export default Rushee;
