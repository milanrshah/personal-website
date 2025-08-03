// Configure axios defaults
import axios from 'axios';

// API Configuration with cache busting
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.milanrs.com';

// Debug: Log the API base URL
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);
console.log('Build timestamp:', new Date().toISOString());

// Set base URL for all API calls
axios.defaults.baseURL = API_BASE_URL;

export default axios;