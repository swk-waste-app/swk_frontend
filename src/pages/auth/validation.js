// Small helpers shared by the sign-in, sign-up and account setup forms.

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// The message to show when a request fails: the server's own explanation when
// it sent one, otherwise the fallback written for that form.
export const apiErrorMessage = (error, fallback) => {
  if (!error.response) return 'Could not reach the server. Check your connection and try again.';
  const message = error.response.data?.message;
  return typeof message === 'string' && message ? message : fallback;
};
