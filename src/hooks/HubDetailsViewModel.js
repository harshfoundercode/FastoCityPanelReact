// src/hooks/useHubDetailsViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useHubDetailsViewModel = () => {
  const [hubDetails, setHubDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchHubDetails = useCallback(async (hubId) => {
    if (!hubId) {
      toast.error('Invalid hub ID');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`🏢 Fetching hub details for ID: ${hubId}`);

      const response = await apiClient.get(ENDPOINTS.HUB_DETAILS(hubId));

      console.log('✅ HUB DETAILS RESPONSE =>', response);
      console.log('✅ HUB DETAILS DATA =>', response.data);

      if (response.status === 200) {
        const details = response.data?.data;
        setHubDetails(details);
        
        console.log('🏢 HUB DETAILS =>', details);
        
        toast.success(
          response.data?.message || 'Hub details loaded'
        );
        
        return details;
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.log('❌ HUB DETAILS ERROR =>', error);

      let errorMessage = 'Failed to load hub details';

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
            errorMessage = 'Hub not found';
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

  const clearHubDetails = useCallback(() => {
    setHubDetails(null);
    setError(null);
  }, []);

  return {
    hubDetails,
    isLoading,
    error,
    fetchHubDetails,
    clearHubDetails,
  };
};