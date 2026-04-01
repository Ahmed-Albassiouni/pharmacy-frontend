import axios from 'axios';

const defaultApiBaseURL =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:5000/api`
    : 'https://pharmacy-backend-eight.vercel.app/api';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || defaultApiBaseURL,
  timeout: 10000,
});

export default apiClient;
