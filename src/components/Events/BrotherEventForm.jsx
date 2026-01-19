import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { submitBrotherForm, getEventById } from '../../utils/api';
import { getBrotherData } from '../../utils/auth';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4a5568;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
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

  @media (max-width: 768px) {
    padding: 0.4rem;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  min-height: 100px;
  margin-top: 0.25rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
    min-height: 80px;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`;

const RatingButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: ${props => (props.selected ? '#3182ce' : 'white')};
  color: ${props => (props.selected ? 'white' : '#2d3748')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => (props.selected ? '#2c5282' : '#f7fafc')};
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.4rem;
  }
`;

const ChoiceLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: #f7fafc;
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
    font-size: 0.9rem;
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
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const Error = styled.div`
  color: #e53e3e;
  margin-top: 0.5rem;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  ${props => props.type === 'success' 
    ? `
      background-color: #c6f6d5;
      color: #276749;
      border: 1px solid #9ae6b4;
    ` 
    : `
      background-color: white;
      color: black;
    `}

  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
`;


const BrotherEventForm = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const brother = getBrotherData();

  useEffect(() => {
    if (!brother) {
      navigate('/login');
      return;
    }
    fetchEventDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, navigate, brother]);

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await getEventById(eventId, brother.frat);
      if (response.data?.success) {
        setEvent(response.data.data);
      } else {
        throw new Error('Failed to fetch event details');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setMessage({
        type: 'error',
        content: 'Failed to load event details. Please try again.'
      });
    }
  }, [eventId, brother.frat]);

  const validateForm = () => {
    const newErrors = {};
    event.brotherForm.questions.forEach((question, index) => {
      if (question.required && !formResponses[index]) {
        newErrors[index] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (index, value) => {
    setFormResponses(prev => ({
      ...prev,
      [index]: value
    }));
    
    if (errors[index]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      await submitBrotherForm(eventId, formResponses);
      setMessage({
        type: 'success',
        content: 'Form submitted successfully!'
      });
      setFormResponses({});
    } catch (error) {
      setMessage({
        type: 'error',
        content: error.response?.data?.error || 'Failed to submit form'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question, index) => {
    switch (question.questionType) {
      case 'text':
        return (
          <Input
            type="text"
            value={formResponses[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Your answer"
          />
        );

      case 'textarea':
        return (
          <TextArea
            value={formResponses[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Your answer"
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
                    const currentValues = formResponses[index] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(value => value !== option);
                    handleInputChange(index, newValues);
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

  if (!event) {
    return (
      <FormContainer>
        <Card>
          <Message type="error">Loading...</Message>
        </Card>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Card>
        <Title>{event.name} - Brother Form</Title>
        
        {message.content && (
          <Message type={message.type}>
            {message.content}
          </Message>
        )}

        <form onSubmit={handleSubmit}>
          {event.brotherForm.questions.map((question, index) => (
            <FormGroup key={index}>
              <Label>
                {question.question}
                {question.required && ' *'}
              </Label>
              {renderQuestion(question, index)}
              {errors[index] && <Error>{errors[index]}</Error>}
            </FormGroup>
          ))}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </Button>
        </form>
      </Card>
    </FormContainer>
  );
};

export default BrotherEventForm;