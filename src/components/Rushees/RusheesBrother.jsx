import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  getAllRushees, 
  getAllEvents, 
  getFraternity, 
  addFraternityTag, 
  removeFraternityTag, 
  addRusheeTag 
} from '../../utils/api';
import { getBrotherData } from '../../utils/auth';
import Rushee from './Rushee';
import CSVExport from './CSVExport';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
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

  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem;
    max-height: 95vh;
    top: 2.5vh;
    transform: translateX(-50%);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  -webkit-tap-highlight-color: transparent;
`;

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
    max-height: 150px;

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      input[type="checkbox"] {
        width: 18px;
        height: 18px;
      }
    }
  }
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  color: #4a5568;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  height: 44px;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: red;
  }

  @media (max-width: 768px) {
    top: 0.25rem;
    right: 0.25rem;
  }
`;

const FiltersContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FilterSection = styled.div`
  background: #f7fafc;
  padding: 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const TagsContainer = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 1rem;
  padding: 1.25rem;
  background: #edf2f7;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  margin: 0.25rem;
  padding: 0.5rem 0.75rem;
  background: #3182ce;
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  min-height: 36px;

  &:hover {
    background: #2c5282;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    margin: 0.25rem;
  }
`;

const AddTagInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-right: 0.5rem;
  width: 100%;
  max-width: 300px;
  height: 44px;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  width: 100%;
  height: 44px;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 44px;
  font-size: 1rem;
  display: inline-flex;
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

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const RusheeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const RusheeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

const RusheeInfo = styled.div`
  flex: 1;
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

const RusheeStatus = styled.div`
  color: #444;
  font-size: 14px;
`;

const SearchRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: flex-end;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;

  > * {
    min-width: 0; // Allows children to shrink below their content size
  }

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 1rem;
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0; // Allows flexbox to shrink this element

  @media (max-width: 768px) {
    gap: 0.25rem;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  width: 100%;
  height: 44px;
  min-width: 0; // Allows input to shrink
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    width: 100%;
  }
`;

const DisplayRushees = () => {
  const [rushees, setRushees] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredRushees, setFilteredRushees] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [selectedTagForFilter, setSelectedTagForFilter] = useState('');
  const [selectedTagForBulkAdd, setSelectedTagForBulkAdd] = useState('');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRushee, setSelectedRushee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRushees();
    fetchEvents();
    fetchFraternityTags();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedEvents, selectedStatus, selectedTagForFilter, rushees, searchQuery]);

  const fetchRushees = async () => {
    try {
      const brother = getBrotherData();
      const response = await getAllRushees({ fraternity: brother.frat });
      setRushees(response.data || []);
      setFilteredRushees(response.data || []);
    } catch (error) {
      console.error('Failed to fetch rushees:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const brother = getBrotherData();
      const response = await getAllEvents({ fraternity: brother.frat });
      setEvents(response.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchFraternityTags = async () => {
    try {
      const brother = getBrotherData();
      const response = await getFraternity(brother.frat);
      setTags(response.data.tags || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      const brother = getBrotherData();
      await addFraternityTag(brother.frat, newTag);
      setTags((prev) => [...prev, newTag]);
      setNewTag('');
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  };

  const handleRemoveTag = async (tag) => {
    try {
      const brother = getBrotherData();
      await removeFraternityTag(brother.frat, tag);
      setTags((prev) => prev.filter((t) => t !== tag));
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };

  const handleAddTagToFilteredRushees = async () => {
    if (!selectedTagForBulkAdd) return;
    try {
      for (const rushee of filteredRushees) {
        await addRusheeTag(rushee._id, selectedTagForBulkAdd);
      }
      setFilteredRushees((prev) =>
        prev.map((rushee) => ({
          ...rushee,
          tags: rushee.tags.includes(selectedTagForBulkAdd)
            ? rushee.tags
            : [...rushee.tags, selectedTagForBulkAdd],
        }))
      );
    } catch (error) {
      console.error('Failed to add tag to filtered rushees:', error);
    }
  };

  const handleEventFilterChange = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const applyFilters = () => {
    let filtered = rushees;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((rushee) =>
        rushee.name.toLowerCase().includes(query)
      );
    }

    // Apply event filter
    if (selectedEvents.length > 0) {
      filtered = filtered.filter((rushee) =>
        selectedEvents.every((eventId) =>
          rushee.eventsAttended.some((event) => event._id === eventId)
        )
      );
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter((rushee) => rushee.status === selectedStatus);
    }

    // Apply tag filter
    if (selectedTagForFilter) {
      filtered = filtered.filter((rushee) => rushee.tags.includes(selectedTagForFilter));
    }

    setFilteredRushees(filtered);
  };

  return (
    <Container>
      <SearchRow>
        <SearchSection>
          <Label>Search Rushees</Label>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
          />
        </SearchSection>
        <CSVExport rushees={filteredRushees} allRushees={rushees} />
      </SearchRow>

      <FiltersContainer>
        <FilterSection>
          <Label>Filter by Events Attended</Label>
          <CheckboxList>
            {events.map((event) => (
              <label key={event._id}>
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event._id)}
                  onChange={() => handleEventFilterChange(event._id)}
                />
                {event.name}
              </label>
            ))}
          </CheckboxList>
        </FilterSection>
        <FilterSection>
          <Label>Filter by Status</Label>
          <Select value={selectedStatus} onChange={handleStatusFilterChange}>
            <option value="">All</option>
            <option value="Potential">Potential</option>
            <option value="Active">Active</option>
            <option value="Dropped">Dropped</option>
            <option value="Rejected">Rejected</option>
          </Select>
        </FilterSection>
        <FilterSection>
          <Label>Filter by Tags</Label>
          <Select value={selectedTagForFilter} onChange={(e) => setSelectedTagForFilter(e.target.value)}>
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Select>
        </FilterSection>
      </FiltersContainer>

      <RusheeList>
        {filteredRushees.map((rushee) => (
          <RusheeCard key={rushee._id} onClick={() => setSelectedRushee(rushee)}>
            <ProfileImage>
              {rushee.picture ? (
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
            
            <RusheeInfo>
              <RusheeName>{rushee.name}</RusheeName>
              <RusheeEmail>{rushee.email}</RusheeEmail>
              <ButtonContainer>
                <Button onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event
                  setSelectedRushee(rushee);
                }}>
                  View Details
                </Button>
                {rushee.picture && (
                  <Button onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    window.open(rushee.picture, '_blank');
                  }}>
                    View Image
                  </Button>
                )}
              </ButtonContainer>
            </RusheeInfo>
          </RusheeCard>
        ))}
      </RusheeList>

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

export default DisplayRushees;
