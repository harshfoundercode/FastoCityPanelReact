// src/hooks/useOrderDetailsViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useOrderDetailsViewModel = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrderDetails = useCallback(async (orderId) => {
    if (!orderId) return null;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`📋 Fetching order details for ID: ${orderId}`);

      const response = await apiClient.get(ENDPOINTS.HUB_ALL_ORDERS_DETAILS(orderId));

      console.log('✅ ORDER DETAILS FULL RESPONSE =>', response);
      console.log('✅ ORDER DETAILS DATA =>', response.data);
      console.log('✅ STATUS =>', response.status);

      if (response.status === 200) {
        const details = response.data?.data;
        setOrderDetails(details);
        
        console.log('📋 ORDER =>', details?.order);
        console.log('📋 ITEMS =>', details?.items);
        console.log('📋 TIMELINE =>', details?.timeline);
        
        toast.success(response.data?.message || 'Order details loaded');
        
        return details;
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.log('❌ ORDER DETAILS ERROR =>', error);

      let errorMessage = 'Failed to load order details';

      if (error.response) {
        const status = error.response.status;

        switch (status) {
          case 401:
            errorMessage = 'Session expired';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
            break;
          case 404:
            errorMessage = 'Order not found';
            break;
          case 500:
            errorMessage = 'Server error';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Network error';
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return {
    orderDetails,
    isLoading,
    error,
    fetchOrderDetails,
  };
};