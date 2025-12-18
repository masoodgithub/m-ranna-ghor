import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menu API
export const menuAPI = {
  getAll: () => api.get('/menu'),
  getById: (id) => api.get(`/menu/${id}`),
  getCategories: () => api.get('/menu/categories/all'),
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => api.get('/testimonials'),
};

export default api;