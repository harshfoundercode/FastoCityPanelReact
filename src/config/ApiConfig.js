// src/config/api.config.js
import axios from 'axios';

// Base URLs
const BASE_URL = 'https://root.fastocatz.com/';
const API_URL = `${BASE_URL}api/`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add auth token if exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log("Current Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: You do not have permission');
          break;
        case 404:
          console.error('Not Found: The requested resource was not found');
          break;
        case 500:
          console.error('Internal Server Error: Please try again later');
          break;
        default:
          console.error('An error occurred:', error.response.data?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error: Please check your internet connection');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const ENDPOINTS = {
  MAP_KEY :"AIzaSyAW2lp2BYRmy8oD3ppvvegrql2MlMa-4tI",
  API_URL: API_URL,

  
  LOGIN: 'citylogin',
  DASHBOARD: 'dashboard',
  NOTIFICATIONS: 'city/notifications',
  PROFILE: 'cityprofile',
  ALLHUB:"hub_list",
  HUB_DETAILS: (hubId) => `hub_details/${hubId}`,
  HUB_PROFILE: (hubId) => `hubprofile?id=${hubId}`,  
  HUB_DETAILS_EDIT: 'hubmanager/update',
  HUB_MANAGER_CREATE: 'hubmanager/create',

  HUB_ZONE_LIST: 'hubzone_list',
  HUB_PERFORMANCE: 'performance_hubs',
  HUB_ALL_ORDERS: (hubId) => `hubs/${hubId}/orders`,
  HUB_ALL_ORDERS_DETAILS: (orderId) => `orders/${orderId}`, 

  ALL_ORDERS: 'orders',
  ORDER_PROFILE: 'orderprofile', 


};

export default apiClient;