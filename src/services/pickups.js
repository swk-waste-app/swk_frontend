import { apiClient } from './config';

// The signed-in user's own pickups, latest pickup date first. The server
// returns 100 rows unless told otherwise, so ask for enough to cover a
// long-standing household.
export const apiGetMyPickups = () =>
  apiClient.get('/users/me/schedules', {
    params: { sort: JSON.stringify({ pickupDate: -1 }), limit: 1000 },
  });

// Calls off a pickup that has not started. It stays on record as Cancelled.
export const apiCancelPickup = (id) => apiClient.patch(`/waste-collection/schedules/${id}/cancel`);
