// Configure axios defaults
import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://milsh.onthewifi.com';

// Debug: Log the API base URL
console.log('API Base URL:', API_BASE_URL);
console.log('Environment:', process.env.NODE_ENV);

// Set base URL for all API calls
axios.defaults.baseURL = API_BASE_URL;

export default axios;