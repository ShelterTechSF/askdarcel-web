import axios from 'axios';

const env = process.env.NODE_ENV;
const baseURL = env === 'production' ? 'https://askdarcel.org/' : '/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;
