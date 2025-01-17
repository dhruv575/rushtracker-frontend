import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../../utils/api';
import { getBrotherData, setBrotherData } from '../../utils/auth';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const FormsContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  flex: 1;
  min-width: 300px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 1px #3182ce;
  }
`;

const Button = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2c5282;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  ${props => props.type === 'success' 
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

const UpdateProfile = () => {
  const brother = getBrotherData();
  
  const [profileData, setProfileData] = useState({
    phone: brother?.phone || '',
    major: brother?.major || '',
    year: brother?.year || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState({ type: '', content: '' });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch('/brothers/profile', profileData);
      if (response.data.success) {
        const updatedBrother = { ...brother, ...profileData };
        setBrotherData(updatedBrother);
        setMessage({ type: 'success', content: 'Profile updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.response?.data?.error || 'Failed to update profile' });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', content: 'New passwords do not match' });
      return;
    }
    try {
      const response = await api.patch('/brothers/reset-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response.data.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage({ type: 'success', content: 'Password updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', content: error.response?.data?.error || 'Failed to update password' });
    }
  };

  return (
    <Container>
      <FormsContainer>
        <Card>
          <Title>Update Profile</Title>
          <Form onSubmit={handleProfileUpdate}>
            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="(123) 456-7890"
              />
            </FormGroup>
            <FormGroup>
              <Label>Major</Label>
              <Input
                type="text"
                name="major"
                value={profileData.major}
                onChange={handleProfileChange}
                placeholder="e.g. Computer Science"
              />
            </FormGroup>
            <FormGroup>
              <Label>Year</Label>
              <Input
                type="number"
                name="year"
                value={profileData.year}
                onChange={handleProfileChange}
                min="2000"
                placeholder="e.g. 2024"
              />
            </FormGroup>
            <Button type="submit">Update Profile</Button>
          </Form>
        </Card>

        <Card>
          <Title>Reset Password</Title>
          <Form onSubmit={handlePasswordUpdate}>
            <FormGroup>
              <Label>Current Password</Label>
              <Input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>New Password</Label>
              <Input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </FormGroup>
            <Button type="submit">Update Password</Button>
          </Form>
        </Card>
      </FormsContainer>

      {message.content && (
        <Message type={message.type}>
          {message.content}
        </Message>
      )}
    </Container>
  );
};

export default UpdateProfile;