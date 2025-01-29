import axios from 'axios';
import { clearUserData } from './auth';

const api = axios.create({
  baseURL: 'https://rushtracker-backend-6ca803ef895b.herokuapp.com/api'
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearUserData();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const login = async (email, password) => {
  const response = await api.post('/brothers/login', { email, password });
  return response.data;
};

// Event APIs
export const createEvent = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const getAllEvents = async (filters = {}) => {
  const { startDate, endDate } = filters;
  const params = new URLSearchParams();
  
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await api.get(`/events?${params.toString()}`);
  return response.data;
};

export const getEventById = async (eventId, fraternity) => {
  const response = await api.get(`/events/${eventId}?fraternity=${fraternity}`);
  return response;
};

export const updateEvent = async (eventId, updateData) => {
  const response = await api.patch(`/events/${eventId}`, updateData);
  return response.data;
};

// Form Submissions
export const submitBrotherForm = async (eventId, responses) => {
  const response = await api.post(`/events/${eventId}/submit/brother`, {
    responses
  });
  return response.data;
};

export const submitRusheeForm = async (eventId, rusheeId, responses) => {
  const response = await api.post(`/events/${eventId}/submit/rushee`, {
    rusheeId,
    responses
  });
  return response.data;
};

// Add this to your api.js
export const getAllBrothers = async (filters = {}) => {
  const { fraternity } = filters;
  if (!fraternity) {
    throw new Error('Fraternity ID is required');
  }
  const response = await api.get(`/brothers?fraternity=${fraternity}`);
  return response;
};

// Event Attendance and Submissions
export const getEventAttendees = async (eventId) => {
  const response = await api.get(`/events/${eventId}/attendees`);
  return response.data;
};

export const getEventSubmissions = async (eventId, fraternity, type) => {
  const response = await api.get(`/events/${eventId}/submissions?fraternity=${fraternity}&type=${type}`);
  return response;
};

export const getEventByName = async (eventName) => {
  const response = await api.get(`/events?name=${eventName}`);
  return response.data; // Adjust response as needed
};


// Fraternity APIs
export const getFraternity = async (fratId) => {
  const response = await api.get(`/frats/${fratId}`);
  return response.data;
};

export const addFraternityTag = async (fratId, tag) => {
  const response = await api.post(`/frats/${fratId}/tags`, { tag });
  return response.data;
};

export const removeFraternityTag = async (fratId, tag) => {
  const response = await api.delete(`/frats/${fratId}/tags`, { data: { tag } });
  return response.data;
};

// Rushee APIs
// In api.js
export const getAllRushees = async (filters = {}) => {
  const { fraternity } = filters;
  if (!fraternity) {
    throw new Error('Fraternity ID is required');
  }
  const response = await api.get(`/rushees?fraternity=${fraternity}`);
  return response.data;
};

export const getRusheeById = async (rusheeId, fraternity) => {
  const response = await api.get(`/rushees/${rusheeId}?fraternity=${fraternity}`);
  return response.data;
};

export const updateRusheeStatus = async (rusheeId, status, fraternity) => {
  console.log("API Call - Rushee ID:", rusheeId, "Status:", status);
  const response = await api.patch(`/rushees/${rusheeId}/status?fraternity=${fraternity}`, { status });
  return response.data;
};

export const addRusheeNote = async (rusheeId, content, fraternity, isAnonymous = false) => {
  const response = await api.post(`/rushees/${rusheeId}/notes?fraternity=${fraternity}`, { 
    content,
    isAnonymous 
  });
  return response.data;
};

export const updateRushee = async (rusheeId, data, fraternity) => {
  try {
    await api.patch(`/rushees/${rusheeId}?fraternity=${fraternity}`, data);
  } catch (error) {
    throw new Error('Failed to update rushee profile');
  }
};

export const addRusheeTag = async (rusheeId, tag) => {
  const response = await api.post(`/rushees/${rusheeId}/tags`, { tag });
  return response.data;
};

export const removeRusheeTag = async (rusheeId, tag) => {
  const response = await api.delete(`/rushees/${rusheeId}/tags`, { data: { tag } });
  return response.data;
};

export const uploadImageFile = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Export the API instance
export default api;
