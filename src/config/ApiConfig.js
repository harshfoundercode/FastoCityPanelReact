import axios from 'axios';

// Base URLs
// const BASE_URL = 'https://root.fastocatz.com/';
const BASE_URL = 'https://fasto.honeywithmoon.com/';
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
    // Log full URL and request data
    console.log("Request URL:", `${config.baseURL}${config.url}`);
    console.log("Request Method:", config.method?.toUpperCase());
    console.log("Request Headers:", config.headers);
    console.log("Request Data:", config.data);
    console.log("Request Params:", config.params);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response (optional)
    console.log("Response URL:", response.config.url);
    console.log("Response Data:", response.data);
    console.log("Response Status:", response.status);
    return response;
  },
  (error) => {
     // Log error details
    console.error("Error Request URL:", error.config?.url);
    console.error("Error Request Data:", error.config?.data);
    console.error("Error Response:", error.response?.data);
    console.error("Error Status:", error.response?.status);
    
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
  MAP_KEY: "AIzaSyAW2lp2BYRmy8oD3ppvvegrql2MlMa-4tI",
  API_URL: API_URL,


  LOGIN: 'citylogin',
  DASHBOARD: 'dashboard',
  NOTIFICATIONS: 'notifications',
  PROFILE: 'cityprofile',
  ALLHUB: "hub_list",
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

  URGENT_MAIN_CATEGORIES: 'main-category-list',
  URGENT_CATEGORIES_BY_MAIN: 'category-fulllist',
  URGENT_ADD_ON_REQUEST: 'cityRequests',

  HUB_REQUESTS: 'request/list',
  ACCEPT_HUB_REQUEST: 'accept-request',
  REJECT_HUB_REQUEST: 'reject-request',

  CITY_STOCKS: 'cityStock',
  HUB_LIST: 'hub_list',
  CITY_REQUEST: 'cityRequests',
  CITY_TRANSFER_TO_HUB: 'citytransfer-to-hub',

  ADMIN_REQUEST_HISTORY: "cityRequests",
  HUB_HISTORY: 'cityhub-history',

  ADMIN_INCOMING_STOCK: 'admintransfer_history',
  ACCEPT_INCOMING_TRANSFER: 'accept_transfer',

  CITY_ZONE_LIST: 'cityzone_list',
  HUB_ZONE_EDIT: 'hubzone/update',
  PLACE_AUTOCOMPLETE: 'place_autocomplete',
  PLACE_DETAILS: 'place_details',
};

export default apiClient;