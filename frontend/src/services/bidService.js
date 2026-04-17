import api from './api.js';

export const bidService = {
  place: (carId, amount) =>
    api.post('/api/bids', { carId, amount }).then((r) => r.data),
  forCar: (carId) => api.get(`/api/bids/car/${carId}`).then((r) => r.data),
};
