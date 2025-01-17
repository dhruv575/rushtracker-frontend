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
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 800px;
  max-height: 80vh; /* Limit the height of the modal */
  overflow-y: auto; /* Enable scrolling for overflowing content */
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

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  color: #4a5568;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;

  &:hover {
    color: red;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
`;

const FilterSection = styled.div`
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TagsContainer = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: #edf2f7;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Tag = styled.span`
  display: inline-block;
  margin: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3182ce;
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: #2c5282;
  }
`;

const AddTagInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-right: 0.5rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2c5282;
  }
`;

const RusheeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const RusheeCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex: 1 1 calc(33.333% - 1rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  cursor: pointer;

  &:hover {
    background: #edf2f7;
  }
`;

const SearchRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-end;
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 60%;
  margin-right: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
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
        <TagsContainer>
          <div style={{ marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Label>Manage Tags</Label>
            <AddTagInput
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a new tag"
            />
            <Button onClick={handleAddTag}>Add Tag</Button>
          </div>
          <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {tags.map((tag) => (
              <Tag key={tag} onClick={() => handleRemoveTag(tag)}>
                {tag} &times;
              </Tag>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Label>Add a tag to filtered rushees</Label>
            <Select value={selectedTagForBulkAdd} onChange={(e) => setSelectedTagForBulkAdd(e.target.value)}>
              <option value="">Select a tag</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Select>
            <Button onClick={handleAddTagToFilteredRushees}>Add to Filtered Rushees</Button>
          </div>
        </TagsContainer>
      </FiltersContainer>

      <RusheeList>
        {filteredRushees.map((rushee) => (
          <RusheeCard key={rushee._id} onClick={() => setSelectedRushee(rushee)}>
            <div>
              <strong>{rushee.name}</strong>
            </div>
            <div>{rushee.email}</div>
            <div>Status: {rushee.status}</div>
            <Button>View Details</Button>
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
