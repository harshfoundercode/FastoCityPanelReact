// src/hooks/useHubPerformanceViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useHubPerformanceViewModel = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchHubPerformance = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📊 Fetching hub performance...');

      const response = await apiClient.get(ENDPOINTS.HUB_PERFORMANCE);

      console.log('✅ PERFORMANCE FULL RESPONSE =>', response);
      console.log('✅ PERFORMANCE DATA =>', response.data);
      console.log('✅ STATUS =>', response.status);

      if (response.status === 200) {
        const data = response.data?.data;
        setPerformanceData(data);
        
        console.log('📊 PERFORMANCE =>', data);
        
        toast.success(
          response.data?.message || 'Performance data loaded'
        );
        
        return data;
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.log('❌ PERFORMANCE ERROR =>', error);

      let errorMessage = 'Failed to load performance data';

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
          case 403:
            errorMessage = 'Access denied';
            break;
          case 404:
            errorMessage = 'Performance data not found';
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
    performanceData,
    isLoading,
    error,
    fetchHubPerformance,
  };
};