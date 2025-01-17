import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';

const Container = styled.form`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CardHeader = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
  }
`;

const Select = styled.select`
  width: 180px;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3182ce;
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.4rem;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  ${(props) =>
    props.variant === 'outline'
      ? `
    background-color: white;
    border: 1px solid #e2e8f0;
    color: #4a5568;

    &:hover {
      background-color: #f7fafc;
    }
  `
      : `
    background-color: #3182ce;
    color: white;

    &:hover {
      background-color: #2c5282;
    }
  `}

  ${(props) =>
    props.fullWidth &&
    `
    width: 100%;
  `}

  ${(props) =>
    props.icon &&
    `
    padding: 0.5rem;
    border-radius: 50%;
  `}

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.875rem;
  }
`;

const TabList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Tab = styled.button`
  padding: 0.5rem;
  background: ${(props) => (props.active ? '#3182ce' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#4a5568')};
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: ${(props) => (props.active ? '#2c5282' : '#f7fafc')};
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
    font-size: 0.875rem;
  }
`;

const QuestionCard = styled(Card)`
  margin-bottom: 1rem;
  position: relative;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Switch = styled.input.attrs({ type: 'checkbox' })`
  position: relative;
  width: 40px;
  height: 20px;
  appearance: none;
  background-color: #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:checked {
    background-color: #3182ce;
  }

  &:before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    background-color: white;
    transition: transform 0.2s;
  }

  &:checked:before {
    transform: translateX(20px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const Alert = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  background-color: #fed7d7;
  color: #9b2c2c;
  border: 1px solid #feb2b2;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.8rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;


const QUESTION_TYPES = {
  TEXT: 'text',
  RATING: 'rating',
  MULTIPLE_CHOICE: 'multipleChoice',
  CHECKBOX: 'checkbox',
  TEXTAREA: 'textarea',
};

const CreateEvent = () => {
  const [eventDetails, setEventDetails] = useState({
    name: '',
    location: '',
    start: '',
    end: ''
  });

  const [brotherForm, setBrotherForm] = useState({
    questions: [
      {
        questionType: 'multipleChoice',
        question: 'Did you attend this event?',
        options: ['Yes', 'No'],
        required: true
      }
    ]
  });

  const [rusheeForm, setRusheeForm] = useState({
    questions: [
      {
        questionType: 'text',
        question: 'Full Name (Proper Capitalization)',
        required: true
      },
      {
        questionType: 'text',
        question: 'School Email',
        required: true
      }
    ]
  });

  const [activeTab, setActiveTab] = useState('brother');
  const [error, setError] = useState('');

  const handleEventDetailsChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const addQuestion = (formType) => {
    const newQuestion = {
      questionType: 'text',
      question: '',
      options: [],
      required: false
    };

    if (formType === 'brother') {
      setBrotherForm((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    } else {
      setRusheeForm((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    }
  };

  const removeQuestion = (formType, index) => {
    if ((formType === 'brother' && index === 0) || 
        (formType === 'rushee' && index <= 1)) {
      return;
    }

    if (formType === 'brother') {
      setBrotherForm((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    } else {
      setRusheeForm((prev) => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    }
  };

  const updateQuestion = (formType, index, field, value) => {
    const updateForm = formType === 'brother' ? setBrotherForm : setRusheeForm;
    updateForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === index) {
          return { ...q, [field]: value };
        }
        return q;
      })
    }));
  };

  const updateOptions = (formType, index, options) => {
    const updateForm = formType === 'brother' ? setBrotherForm : setRusheeForm;
    updateForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === index) {
          return { ...q, options: options.split(',').map((opt) => opt.trim()) };
        }
        return q;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!eventDetails.name || !eventDetails.start || !eventDetails.end) {
        setError('Please fill in all required event details');
        return;
      }

      const response = await api.post('/events', {
        ...eventDetails,
        brotherForm,
        rusheeForm
      });

      if (response.data.success) {
        setEventDetails({
          name: '',
          location: '',
          start: '',
          end: ''
        });
        setBrotherForm({
          questions: [
            {
              questionType: 'multipleChoice',
              question: 'Did you attend this event?',
              options: ['Yes', 'No'],
              required: true
            }
          ]
        });
        setRusheeForm({
          questions: [
            {
              questionType: 'text',
              question: 'Full Name (Proper Capitalization)',
              required: true
            },
            {
              questionType: 'text',
              question: 'School Email',
              required: true
            }
          ]
        });
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create event');
    }
  };

  const renderQuestionFields = (question, index, formType) => {
    const isDefault = (formType === 'brother' && index === 0) || 
                     (formType === 'rushee' && index <= 1);

    return (
      <QuestionCard key={index}>
        <QuestionHeader>
          <div style={{ flex: 1 }}>
            <Input
              value={question.question}
              onChange={(e) => updateQuestion(formType, index, 'question', e.target.value)}
              placeholder="Question text"
              disabled={isDefault}
            />
            <InputGroup>
              <Select
                value={question.questionType}
                onChange={(e) => updateQuestion(formType, index, 'questionType', e.target.value)}
                disabled={isDefault}
              >
                {Object.entries(QUESTION_TYPES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
              <SwitchContainer>
                <Switch
                  checked={question.required}
                  onChange={(e) => updateQuestion(formType, index, 'required', e.target.checked)}
                  disabled={isDefault}
                />
                <Label style={{ margin: 0 }}>Required</Label>
              </SwitchContainer>
            </InputGroup>
          </div>
          {!isDefault && (
            <Button
              icon
              variant="outline"
              onClick={() => removeQuestion(formType, index)}
              style={{ marginLeft: '1rem' }}
            >
              🗑️
            </Button>
          )}
        </QuestionHeader>

        {(question.questionType === 'multipleChoice' || question.questionType === 'checkbox') && (
          <Input
            value={question.options?.join(', ') || ''}
            onChange={(e) => updateOptions(formType, index, e.target.value)}
            placeholder="Options (comma-separated)"
            disabled={isDefault}
          />
        )}
      </QuestionCard>
    );
  };

  return (
    <Container onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        
        <FormGroup>
          <Label htmlFor="name">Event Name</Label>
          <Input
            id="name"
            name="name"
            value={eventDetails.name}
            onChange={handleEventDetailsChange}
            placeholder="Event name"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={eventDetails.location}
            onChange={handleEventDetailsChange}
            placeholder="Event location"
          />
        </FormGroup>

        <GridContainer>
          <FormGroup>
            <Label htmlFor="start">Start Time</Label>
            <Input
              id="start"
              name="start"
              type="datetime-local"
              value={eventDetails.start}
              onChange={handleEventDetailsChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="end">End Time</Label>
            <Input
              id="end"
              name="end"
              type="datetime-local"
              value={eventDetails.end}
              onChange={handleEventDetailsChange}
              required
            />
          </FormGroup>
        </GridContainer>
      </Card>

      <Card>
        <TabList>
          <Tab
            type="button"
            active={activeTab === 'brother'}
            onClick={() => setActiveTab('brother')}
          >
            Brother Form
          </Tab>
          <Tab
            type="button"
            active={activeTab === 'rushee'}
            onClick={() => setActiveTab('rushee')}
          >
            Rushee Form
          </Tab>
        </TabList>

        {activeTab === 'brother' && (
          <div>
            <CardHeader>
              <CardTitle>Brother Form Questions</CardTitle>
            </CardHeader>
            {brotherForm.questions.map((q, i) => renderQuestionFields(q, i, 'brother'))}
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => addQuestion('brother')}
            >
              ➕ Add Question
            </Button>
          </div>
        )}

        {activeTab === 'rushee' && (
          <div>
            <CardHeader>
              <CardTitle>Rushee Form Questions</CardTitle>
            </CardHeader>
            {rusheeForm.questions.map((q, i) => renderQuestionFields(q, i, 'rushee'))}
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => addQuestion('rushee')}
            >
              ➕ Add Question
            </Button>
          </div>
        )}
      </Card>

      {error && (
        <Alert>
          ⚠️ {error}
        </Alert>
      )}

      <Button type="submit" fullWidth>
        Create Event
      </Button>
    </Container>
  );
};

export default CreateEvent;
