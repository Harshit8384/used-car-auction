import api from './api.js';

export const userService = {
  getProfile: () => api.get('/api/users/profile').then((r) => r.data),
  updateProfile: (data) => api.put('/api/users/profile', data).then((r) => r.data),
};
