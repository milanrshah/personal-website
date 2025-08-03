// Configure axios defaults
import axios from 'axios';

// API Configuration with cache busting
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://54.166.206.80:5000';

// Debug: Log the API base URL
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);
console.log('Build timestamp:', new Date().toISOString());

// Set base URL for all API calls
axios.defaults.baseURL = API_BASE_URL;

export default axios;