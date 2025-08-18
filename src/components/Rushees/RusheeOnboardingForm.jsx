import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { handleImageUpload } from '../../utils/imageUpload';
import api from '../../utils/api';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    max-width: 100%;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;

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
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 0.25rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-top: 0.25rem;
  background-color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem;
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
  margin-top: 1rem;
  font-size: 1rem;

  &:hover {
    background-color: #2c5282;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 1rem;

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
    font-size: 0.9rem;
  }
`;

const InitialForm = styled.div`
  margin-bottom: 2rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
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
  position: relative;
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

const RusheeOnboardingForm = () => {
  const { fratId } = useParams();
  const navigate = useNavigate();
  const [fratInfo, setFratInfo] = useState(null);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    major: '',
    year: '',
    gpa: '',
    resume: '',
    picture: '',
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchFratInfo = async () => {
      try {
        const response = await api.get(`/frats/${fratId}`);
        setFratInfo(response.data.data);
      } catch (error) {
        setMessage({
          type: 'error',
          content: 'Failed to load fraternity information'
        });
      }
    };

    if (fratId) {
      fetchFratInfo();
    }
  }, [fratId]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Try to find existing rushee
      const response = await api.get(`/rushees/search?email=${email}&fraternity=${fratId}`);
      const existingRushee = response.data.data;
      
      // If rushee exists, populate form with their data
      setFormData({
        name: existingRushee.name || '',
        phone: existingRushee.phone || '',
        major: existingRushee.major || '',
        year: existingRushee.year?.toString() || '',
        gpa: existingRushee.gpa?.toString() || '',
        resume: existingRushee.resume || '',
        picture: existingRushee.picture || '',
      });
      
    } catch (error) {
      // If rushee doesn't exist, that's fine - we'll create a new one
      if (error.response?.status !== 404) {
        setMessage({
          type: 'error',
          content: 'Error checking rushee status'
        });
        setIsSubmitting(false);
        return;
      }
    }
    
    setEmailSubmitted(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name) return false;
    if (!formData.phone) return false;
    if (!formData.major) return false;
    if (!formData.year) return false;
    if (formData.gpa && (parseFloat(formData.gpa) < 0 || parseFloat(formData.gpa) > 4)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setMessage({
        type: 'error',
        content: 'Please fill in all required fields'
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      // First try to find the rushee
      let rusheeId;
      try {
        const findResponse = await api.get(`/rushees/search?email=${email}&fraternity=${fratId}`);
        rusheeId = findResponse.data.data._id;
      } catch (error) {
        if (error.response?.status === 404) {
          // Rushee not found, create new one
          const createResponse = await api.post('/rushees', {
            ...formData,
            email,
            fraternity: fratId
          });
          rusheeId = createResponse.data.data._id;
        } else {
          throw error;
        }
      }

      // If we found or created a rushee, update their information
      if (rusheeId) {
        // Only send allowed fields to the update endpoint
        const updateData = {
          phone: formData.phone,
          major: formData.major,
          year: formData.year,
          gpa: formData.gpa,
          picture: formData.picture,
          resume: formData.resume,
        };
        await api.patch(`/rushees/${rusheeId}?fraternity=${fratId}`, updateData);
      }

      setMessage({
        type: 'success',
        content: 'Information updated successfully!'
      });

    } catch (error) {
      setMessage({
        type: 'error',
        content: error.response?.data?.message || 'Failed to update information'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setMessage({ type: '', content: '' });
      const imageUrl = await handleImageUpload(file);
      
      setFormData(prev => ({
        ...prev,
        picture: imageUrl
      }));
      
      setMessage({
        type: 'success',
        content: 'Image uploaded successfully!'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        content: error.message || 'Failed to upload image'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (!fratInfo) {
    return (
      <FormContainer>
        <Card>
          <Title>Loading...</Title>
        </Card>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Card>
        <Title>{fratInfo.name} - Rushee Information Form</Title>
        
        {message.content && (
          <Message type={message.type}>{message.content}</Message>
        )}

        {!emailSubmitted ? (
          <InitialForm>
            <form onSubmit={handleEmailSubmit}>
              <FormGroup>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                  required
                />
              </FormGroup>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Checking...' : 'Continue'}
              </Button>
            </form>
          </InitialForm>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Full Name *</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone Number *</Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Major *</Label>
              <Input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Year *</Label>
              <Select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
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
              <Label>Profile Picture *</Label>
              <ImageUploadContainer>
                <ImagePreviewContainer hasImage={!!formData.picture}>
                  {formData.picture ? (
                    <PreviewImage 
                      src={formData.picture} 
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
                  required
                />
                
                <UploadButton 
                  htmlFor="profile-picture"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <LoadingSpinner />
                  ) : formData.picture ? (
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
                value={formData.resume}
                onChange={handleInputChange}
                placeholder="https://"
              />
            </FormGroup>

            <Button 
              type="submit" 
              disabled={isSubmitting || uploadingImage}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        )}
      </Card>
    </FormContainer>
  );
};

export default RusheeOnboardingForm;