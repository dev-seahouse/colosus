export const createBaseURL = () => {
  // refer to localhost
  const DEFAULT_API_BASE_URL = 'http://localhost:9000';

  if (import.meta.env.DEV) {
    return DEFAULT_API_BASE_URL;
  }

  return import.meta.env['VITE_API_BASE_URL'] ?? DEFAULT_API_BASE_URL;
};
