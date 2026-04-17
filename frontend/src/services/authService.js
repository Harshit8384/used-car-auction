import api from './api.js';

export const authService = {
  register: (data) => api.post('/api/auth/register', data).then((r) => r.data),
  login: (data) => api.post('/api/auth/login', data).then((r) => r.data),
};
