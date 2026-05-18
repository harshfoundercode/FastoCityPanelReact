// src/hooks/useHubOrdersViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useHubOrdersViewModel = () => {
  const [ordersData, setOrdersData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchHubOrders = useCallback(async (hubId) => {
    if (!hubId) return null;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`📦 Fetching orders for hub ID: ${hubId}`);

      const response = await apiClient.get(ENDPOINTS.HUB_ALL_ORDERS(hubId));

      console.log('✅ ORDERS FULL RESPONSE =>', response);
      console.log('✅ ORDERS DATA =>', response.data);
      console.log('✅ STATUS =>', response.status);

      if (response.status === 200) {
        const orders = response.data?.data;
        setOrdersData(orders);
        
        console.log('📦 ORDERS =>', orders);
        console.log('📦 TOTAL ORDERS =>', orders?.length);
        
        toast.success(
          response.data?.message || 'Orders loaded successfully'
        );
        
        return orders;
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.log('❌ ORDERS ERROR =>', error);

      let errorMessage = 'Failed to load orders';

      if (error.response) {
        console.log('❌ ERROR STATUS =>', error.response.status);
        console.log('❌ ERROR DATA =>', error.response.data);

        const status = error.response.status;

        switch (status) {
          case 401:
            errorMessage = 'Session expired';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
            break;
          case 404:
            errorMessage = 'Orders not found';
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
    ordersData,
    isLoading,
    error,
    fetchHubOrders,
  };
};