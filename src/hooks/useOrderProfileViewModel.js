// src/hooks/useOrderProfileViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useOrderProfileViewModel = () => {
  const [orderProfile, setOrderProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrderProfile = useCallback(async (orderId) => {
    if (!orderId) return null;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`📋 Fetching order profile for ID: ${orderId}`);

      const response = await apiClient.post(ENDPOINTS.ORDER_PROFILE, {
        id: orderId,
      });

      console.log('✅ ORDER PROFILE FULL RESPONSE =>', response);
      console.log('✅ ORDER PROFILE DATA =>', response.data);
      console.log('✅ STATUS =>', response.status);

      if (response.status === 200) {
        const data = response.data?.data;
        setOrderProfile(data);
        
        console.log('📋 ORDER =>', data?.order);
        console.log('📋 ITEMS =>', data?.items);
        console.log('📋 TRACKING =>', data?.tracking);
        
        toast.success(response.data?.message || 'Order details loaded');
        return data;
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.log('❌ ORDER PROFILE ERROR =>', error);

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
    orderProfile,
    isLoading,
    error,
    fetchOrderProfile,
  };
};