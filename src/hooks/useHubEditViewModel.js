// src/hooks/useEditHubViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useEditHubViewModel = () => {
  const [hubProfile, setHubProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch hub profile
  const fetchHubProfile = useCallback(async (hubId) => {
    if (!hubId) return null;

    setIsLoading(true);
    setError(null);

    try {
      console.log(`👤 Fetching hub profile for ID: ${hubId}`);
      
      const response = await apiClient.get(ENDPOINTS.HUB_PROFILE(hubId));
      
      console.log('✅ HUB PROFILE RESPONSE =>', response.data);
      
      if (response.status === 200) {
        const profile = response.data?.data;
        setHubProfile(profile);
        return profile;
      }
    } catch (error) {
      console.log('❌ HUB PROFILE ERROR =>', error);
      
      let errorMessage = 'Failed to load hub profile';
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return null;
      }
      
      setError(error.response?.data?.message || errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Update hub profile
  const updateHubProfile = useCallback(async (formData) => {
    setIsUpdating(true);
    setError(null);

    try {
      console.log('📝 Updating hub profile...', formData);
      
      const response = await apiClient.post(ENDPOINTS.HUB_DETAILS_EDIT, formData);
      
      console.log('✅ UPDATE RESPONSE =>', response.data);
      
      if (response.status === 200) {
        toast.success(response.data?.message || 'Hub updated successfully');
        return response.data;
      }
    } catch (error) {
      console.log('❌ UPDATE ERROR =>', error);
      
      let errorMessage = 'Failed to update hub';
      
      if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          const firstError = Object.values(errors)[0];
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    hubProfile,
    isLoading,
    isUpdating,
    error,
    fetchHubProfile,
    updateHubProfile,
  };
};