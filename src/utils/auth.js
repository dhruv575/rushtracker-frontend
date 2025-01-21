// src/utils/auth.js
export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const getAuthToken = () => {
    return localStorage.getItem('token');
  };
  
  export const removeAuthToken = () => {
    localStorage.removeItem('token');
  };
  
  export const setBrotherData = (data) => {
    localStorage.setItem('brotherData', JSON.stringify(data));
  };
  
  export const getBrotherData = () => {
    const data = localStorage.getItem('brotherData');
    return data ? JSON.parse(data) : null;
  };

export const clearUserData = () => {
  localStorage.removeItem('brotherData');
  localStorage.removeItem('token');
};