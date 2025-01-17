import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 0.25rem;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 0.25rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const RatingButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: ${props => props.selected ? '#3182ce' : 'white'};
  color: ${props => props.selected ? 'white' : '#2d3748'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.selected ? '#2c5282' : '#f7fafc'};
  }
`;

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ChoiceLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;

  &:hover {
    background: #f7fafc;
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  ${({ type }) =>
    type === 'success'
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

const RusheeEventForm = ({ event, fraternity, isPublic }) => {
  const [formResponses, setFormResponses] = useState({});
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!event?.rusheeForm?.questions) {
      setMessage({
        type: 'error',
        content: 'Invalid event data. Please contact the event organizer.'
      });
    }
  }, [event]);

  const validateForm = () => {
    if (!event?.rusheeForm?.questions) return false;
    
    const newErrors = {};
    event.rusheeForm.questions.forEach((question, index) => {
      if (question.required && !formResponses[index]) {
        newErrors[index] = 'This field is required';
      }
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (index, value) => {
    setFormResponses((prev) => ({ ...prev, [index]: value }));
  };

  const renderQuestionInput = (question, index) => {
    switch (question.questionType) {
      case 'text':
        return (
          <Input
            type="text"
            value={formResponses[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <TextArea
            value={formResponses[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        );

      case 'rating':
        return (
          <RatingContainer>
            {[...Array(10)].map((_, i) => (
              <RatingButton
                key={i + 1}
                type="button"
                selected={formResponses[index] === (i + 1).toString()}
                onClick={() => handleInputChange(index, (i + 1).toString())}
              >
                {i + 1}
              </RatingButton>
            ))}
          </RatingContainer>
        );

      case 'multipleChoice':
        return (
          <ChoiceContainer>
            {question.options.map((option, i) => (
              <ChoiceLabel key={i}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  checked={formResponses[index] === option}
                  onChange={() => handleInputChange(index, option)}
                />
                {option}
              </ChoiceLabel>
            ))}
          </ChoiceContainer>
        );

      case 'checkbox':
        return (
          <ChoiceContainer>
            {question.options.map((option, i) => (
              <ChoiceLabel key={i}>
                <input
                  type="checkbox"
                  checked={(formResponses[index] || []).includes(option)}
                  onChange={(e) => {
                    const currentResponses = formResponses[index] || [];
                    const newResponses = e.target.checked
                      ? [...currentResponses, option]
                      : currentResponses.filter(r => r !== option);
                    handleInputChange(index, newResponses);
                  }}
                />
                {option}
              </ChoiceLabel>
            ))}
          </ChoiceContainer>
        );

      default:
        return <Input type="text" />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      const email = formResponses[event.rusheeForm.questions.findIndex((q) =>
        q.question.toLowerCase().includes('email')
      )];

      let rusheeId = null;

      try {
        const findResponse = await api.get(
          `/rushees/search?email=${email}&fraternity=${fraternity._id}`
        );
        rusheeId = findResponse.data?.data?._id || null;
      } catch (error) {
        if (error.response?.status !== 404) {
          throw new Error('Error searching for Rushee');
        }
      }

      if (!rusheeId) {
        const createResponse = await api.post('/rushees', {
          email,
          fraternity: fraternity._id,
          name: formResponses[
            event.rusheeForm.questions.findIndex((q) =>
              q.question.toLowerCase().includes('name')
            )
          ] || '',
          eventsAttended: [event._id],
        });
        rusheeId = createResponse.data.data._id;
      }

      await api.post(`/events/${event._id}/submit/rushee?fraternity=${fraternity._id}`, {
        rusheeId,
        responses: formResponses
      });

      setMessage({ type: 'success', content: 'Form submitted successfully!' });
      setFormResponses({});
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: error.message || 'Failed to submit form. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event?.rusheeForm?.questions) {
    return (
      <FormContainer>
        <Card>
          <Message type="error">
            {message.content || 'Event form data is not available'}
          </Message>
        </Card>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Card>
        <Title>{event.name} - Rushee Form</Title>
        {message.content && <Message type={message.type}>{message.content}</Message>}
        <form onSubmit={handleSubmit}>
          {event.rusheeForm.questions.map((question, index) => (
            <FormGroup key={index}>
              <Label>
                {question.question}
                {question.required && ' *'}
              </Label>
              {renderQuestionInput(question, index)}
            </FormGroup>
          ))}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Card>
    </FormContainer>
  );
};

export default RusheeEventForm;