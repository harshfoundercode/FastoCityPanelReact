// src/hooks/useHubsViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useHubsViewModel = () => {
  const [hubsData, setHubsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // FETCH HUBS
  const fetchHubs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🏢 Fetching hubs...');

      const response = await apiClient.get(ENDPOINTS.ALLHUB);

      console.log('✅ HUBS FULL RESPONSE =>', response);
      console.log('✅ HUBS DATA =>', response.data);
      console.log('✅ STATUS =>', response.status);

      if (response.status === 200) {
        const hubs = response.data?.data;

        setHubsData(hubs);

        console.log('🏢 HUBS DATA =>', hubs);

        toast.success(
          response.data?.message || 'Hubs loaded successfully'
        );

        return hubs;
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.log('❌ HUBS ERROR =>', error);

      let errorMessage = 'Failed to load hubs';

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
            errorMessage = 'Hubs not found';
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
    hubsData,
    isLoading,
    error,
    fetchHubs,
  };
};