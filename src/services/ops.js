import { apiClient } from './config';

// API calls used by the operations (admin) screens.

// Every household's pickups, newest pickup date first, each with its
// household under `user` ({ name, email, contactNumber, location }).
export const apiGetPickups = (params) =>
  apiClient.get('/waste-collection/history', { params });

// Moves a pickup to another status. `body` is { status, actualWeight?, agentName? }
// and the response carries the updated pickup under `pickup`.
export const apiUpdatePickupStatus = (id, body) =>
  apiClient.patch(`/waste-collection/${id}/status`, body);

// Counts and totals for the operations overview, worked out for the viewer's
// own calendar day.
export const apiGetOpsSummary = () =>
  apiClient.get('/waste-collection/summary', {
    params: { tzOffset: new Date().getTimezoneOffset() },
  });

// The message the server sent with a failed request, or `fallback`.
export const apiErrorMessage = (error, fallback) => {
  if (!error?.response) return 'The server could not be reached. Check your connection and try again.';
  const data = error.response.data;
  // Some endpoints answer with a bare string; an HTML error page is not a message.
  if (typeof data === 'string') return data.trim() && !data.trim().startsWith('<') ? data : fallback;
  return data?.message || fallback;
};
