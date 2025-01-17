import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getRusheeById, updateRusheeStatus, addRusheeNote, updateRushee, addRusheeTag, removeRusheeTag, getFraternity } from '../../utils/api';
import { getBrotherData } from '../../utils/auth';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
`;

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleString(); // Adjust options for desired format
};

const Rushee = ({ rusheeId }) => {
  const [rushee, setRushee] = useState(null);
  const [fraternity, setFraternity] = useState(null);
  const [fraternityTags, setFraternityTags] = useState([]);
  const [status, setStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const brother = getBrotherData(); // Add this line

  const fetchTags = () => {
    setTags(rushee.tags || []); // Use rushee's tags if available
  };
  
  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      const response = await addRusheeTag(rushee._id, newTag); // Use API to add the tag
      console.log('Tag added:', response);
      setTags((prev) => [...prev, newTag]); // Update the local state
      setNewTag(''); // Clear the input field
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };
  
  const handleRemoveTag = async (tag) => {
    try {
      const response = await removeRusheeTag(rushee._id, tag); // Use API to remove the tag
      console.log('Tag removed:', response);
      setTags((prev) => prev.filter((t) => t !== tag)); // Update the local state
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };
  

  useEffect(() => {
    console.log("Fetching Rushee details for ID:", rusheeId);
    fetchRusheeDetails();
  }, [rusheeId]);


  const fetchRusheeDetails = async () => {
    try {
      const response = await getRusheeById(rusheeId, brother.frat);
      console.log('Rushee details fetched successfully:', response.data);
      setRushee(response.data);
      setStatus(response.data.status);
  
      // Set rushee tags
      setTags(response.data.tags || []);
  
      // Fetch fraternity details only if `fraternity` exists
      if (response.data.fraternity) {
        const fratResponse = await getFraternity(response.data.fraternity);
        console.log('Fraternity details fetched successfully:', fratResponse.data);
        setFraternityTags(fratResponse.data.tags || []);
      } else {
        console.warn('Fraternity ID not available in rushee data');
        setFraternityTags([]);
      }
    } catch (error) {
      console.error('Failed to fetch rushee details:', error);
    }
  };
  
  
  

  const handleStatusChange = async (e) => {
    const selectedStatus = e.target.value;
    console.log("Updating status to:", selectedStatus);

    try {
      await updateRusheeStatus(rushee._id, selectedStatus, brother.frat);
      console.log("Status updated successfully.");
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
      console.log("Adding note:", newNote);
      await addRusheeNote(rushee._id, newNote, brother.frat);
      console.log("Note added successfully.");

      const updatedRushee = await getRusheeById(rushee._id, brother.frat);
      console.log("Refetched Rushee after adding note:", updatedRushee.data);
      setRushee(updatedRushee.data);
      setNewNote('');
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  if (!rushee) return <Container>Loading...</Container>;

  return (
    <Container>
      <Header>
        <Title>{rushee.name}</Title>
        <Subtitle>{rushee.email}</Subtitle>
      </Header>

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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  background: '#3182ce',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} &times;
              </span>
            ))
          ) : (
            <p>No tags available.</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Select
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              flex: '1',
            }}
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
        </div>
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
          rushee.notes.map((note) => {
            console.log("Processing note:", note);
            return (
              <div key={note._id} style={{ marginBottom: "1rem" }}>
                <p>{note.content}</p>
                <small>
                  By: {note.author?.name || "Unknown Author"} (
                  {note.author?.email || "No Email"}) on{" "}
                  {formatTimestamp(note.timestamp)}
                </small>
              </div>
            );
          })
        ) : (
          <p>No notes available.</p>
        )}
        <NoteInput
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
        />
        <Button onClick={handleAddNote} disabled={loading}>
          {loading ? "Adding..." : "Add Note"}
        </Button>
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
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                            <thead>
                            <tr>
                                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Question</th>
                                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '0.5rem' }}>Answer</th>
                            </tr>
                            </thead>
                            <tbody>
                            {event.rusheeForm.questions.map((question, qIndex) => (
                                <tr key={qIndex}>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>{question.question}</td>
                                <td style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
                                    {parsedResponses[qIndex] || 'No Response'}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
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
