import api from './api.js';

export const carService = {
  list: () => api.get('/api/cars').then((r) => r.data),
  get: (id) => api.get(`/api/cars/${id}`).then((r) => r.data),
  create: (data) => api.post('/api/cars', data).then((r) => r.data),
};
