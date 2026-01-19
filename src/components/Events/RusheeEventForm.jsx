import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';
import { handleImageUpload } from '../../utils/imageUpload';

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
    font-size: 1.2rem;
    margin-bottom: 1rem;
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
  margin-top: 0.25rem;
  min-height: 100px;
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

  &:hover {
    background: #f7fafc;
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
    font-size: 0.9rem;
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

  @media (max-width: 768px) {
    padding: 0.8rem;
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

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 0.25rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ImagePreviewContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: ${props => props.hasImage ? 'none' : '2px dashed #ccc'};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.hasImage ? 'transparent' : '#f8f9fa'};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
  text-align: center;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const UploadIcon = styled.div`
  color: #666;
  font-size: 40px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const SecondaryButton = styled.button`
  background-color: #e2e8f0;
  color: #2d3748;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #cbd5e0;
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    gap: 0.5rem;
  }
`;

const Step = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  background-color: ${props => 
    props.active ? '#3182ce' : 
    props.completed ? '#48bb78' : '#e2e8f0'};
  color: ${props => 
    props.active || props.completed ? 'white' : '#4a5568'};

  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
    font-size: 12px;
  }
`;


const RusheeEventForm = ({ event, fraternity, isPublic }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [rusheeData, setRusheeData] = useState(null);
  const [rusheeInfo, setRusheeInfo] = useState({
    name: '',
    phone: '',
    major: '',
    year: '',
    gpa: '',
    picture: '',
    resume: ''
  });
  const [formResponses, setFormResponses] = useState({});
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!event?.rusheeForm?.questions) {
      setMessage({
        type: 'error',
        content: 'Invalid event data. Please contact the event organizer.'
      });
    }
  }, [event]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      const response = await api.get(
        `/rushees/search?email=${email}&fraternity=${fraternity._id}`
      );
      const existingRushee = response.data.data;
      
      setRusheeData(existingRushee);
      setRusheeInfo({
        name: existingRushee.name || '',
        phone: existingRushee.phone || '',
        major: existingRushee.major || '',
        year: existingRushee.year?.toString() || '',
        gpa: existingRushee.gpa?.toString() || '',
        picture: existingRushee.picture || '',
        resume: existingRushee.resume || ''
      });
      
      // If rushee exists and has complete info, go to step 3
      if (existingRushee.name && existingRushee.phone && existingRushee.major && existingRushee.year && existingRushee.picture) {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Rushee doesn't exist, go to information collection
        setCurrentStep(2);
      } else {
        setMessage({
          type: 'error',
          content: 'Error checking rushee status'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateRusheeInfo = () => {
    return rusheeInfo.name && rusheeInfo.phone && rusheeInfo.major && rusheeInfo.year && rusheeInfo.picture;
  };

  const handleRusheeInfoSubmit = async (e) => {
    e.preventDefault();
    if (!validateRusheeInfo()) {
      setMessage({
        type: 'error',
        content: 'Please fill in all required fields'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      if (rusheeData) {
        // Update existing rushee
        const updateData = {
          phone: rusheeInfo.phone,
          major: rusheeInfo.major,
          year: rusheeInfo.year,
          gpa: rusheeInfo.gpa,
          picture: rusheeInfo.picture,
          resume: rusheeInfo.resume,
        };
        await api.patch(`/rushees/${rusheeData._id}?fraternity=${fraternity._id}`, updateData);
      } else {
        // Create new rushee
        const createResponse = await api.post('/rushees', {
          ...rusheeInfo,
          email,
          fraternity: fraternity._id
        });
        setRusheeData(createResponse.data.data);
      }

      setCurrentStep(3);
    } catch (error) {
      setMessage({
        type: 'error',
        content: error.response?.data?.message || 'Failed to save information'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEventForm = () => {
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

  const handleRusheeInfoChange = (e) => {
    const { name, value } = e.target;
    setRusheeInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setMessage({ type: '', content: '' });
      const imageUrl = await handleImageUpload(file);
      
      setRusheeInfo(prev => ({
        ...prev,
        picture: imageUrl
      }));
      
    } catch (error) {
      setMessage({
        type: 'error',
        content: error.message || 'Failed to upload image'
      });
    } finally {
      setUploadingImage(false);
    }
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

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateEventForm()) return;

    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      const rusheeId = rusheeData._id;

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

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit}>
      <FormGroup>
        <Label>Email Address *</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
          required
          placeholder="Enter your email address"
        />
      </FormGroup>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Checking...' : 'Continue'}
      </Button>
    </form>
  );

  const renderInfoStep = () => (
    <form onSubmit={handleRusheeInfoSubmit}>
      <FormGroup>
        <Label>Full Name *</Label>
        <Input
          type="text"
          name="name"
          value={rusheeInfo.name}
          onChange={handleRusheeInfoChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Phone Number *</Label>
        <Input
          type="tel"
          name="phone"
          value={rusheeInfo.phone}
          onChange={handleRusheeInfoChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Major *</Label>
        <Input
          type="text"
          name="major"
          value={rusheeInfo.major}
          onChange={handleRusheeInfoChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label>Year *</Label>
        <Select
          name="year"
          value={rusheeInfo.year}
          onChange={handleRusheeInfoChange}
          required
        >
          <option value="">Select Year</option>
          <option value="1">Freshman</option>
          <option value="2">Sophomore</option>
          <option value="3">Junior</option>
          <option value="4">Senior</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>GPA</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          max="4"
          name="gpa"
          value={rusheeInfo.gpa}
          onChange={handleRusheeInfoChange}
          placeholder="Optional"
        />
      </FormGroup>

      <FormGroup>
        <Label>Profile Picture *</Label>
        <ImageUploadContainer>
          <ImagePreviewContainer hasImage={!!rusheeInfo.picture}>
            {rusheeInfo.picture ? (
              <PreviewImage 
                src={rusheeInfo.picture} 
                alt="Profile preview" 
              />
            ) : (
              <UploadIcon>📸</UploadIcon>
            )}
          </ImagePreviewContainer>
          
          <FileInput
            type="file"
            id="profile-picture"
            accept="image/*,.heic,.heif"
            onChange={handleImageChange}
            disabled={uploadingImage}
          />
          
          <UploadButton 
            htmlFor="profile-picture"
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <LoadingSpinner />
            ) : rusheeInfo.picture ? (
              'Change Photo'
            ) : (
              'Upload Photo'
            )}
          </UploadButton>
        </ImageUploadContainer>
      </FormGroup>

      <FormGroup>
        <Label>Resume Link</Label>
        <Input
          type="url"
          name="resume"
          value={rusheeInfo.resume}
          onChange={handleRusheeInfoChange}
          placeholder="https://..."
        />
      </FormGroup>

      <ButtonContainer>
        <SecondaryButton 
          type="button" 
          onClick={() => setCurrentStep(1)}
          disabled={isSubmitting}
        >
          Back
        </SecondaryButton>
        <Button type="submit" disabled={isSubmitting || uploadingImage}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </ButtonContainer>
    </form>
  );

  const renderEventFormStep = () => (
    <form onSubmit={handleEventFormSubmit}>
      {event.rusheeForm.questions.map((question, index) => (
        <FormGroup key={index}>
          <Label>
            {question.question}
            {question.required && ' *'}
          </Label>
          {renderQuestionInput(question, index)}
        </FormGroup>
      ))}
      <ButtonContainer>
        <SecondaryButton 
          type="button" 
          onClick={() => setCurrentStep(2)}
          disabled={isSubmitting}
        >
          Back
        </SecondaryButton>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </ButtonContainer>
    </form>
  );

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
        
        <StepIndicator>
          <Step active={currentStep === 1} completed={currentStep > 1}>1</Step>
          <Step active={currentStep === 2} completed={currentStep > 2}>2</Step>
          <Step active={currentStep === 3}>3</Step>
        </StepIndicator>

        {message.content && <Message type={message.type}>{message.content}</Message>}
        
        {currentStep === 1 && renderEmailStep()}
        {currentStep === 2 && renderInfoStep()}
        {currentStep === 3 && renderEventFormStep()}
      </Card>
    </FormContainer>
  );
};

export default RusheeEventForm;