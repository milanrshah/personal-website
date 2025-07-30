// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// Configure axios defaults
import axios from 'axios';

// Set base URL for all API calls
axios.defaults.baseURL = API_BASE_URL;

export default axios; 