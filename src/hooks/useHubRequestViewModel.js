// src/hooks/useHubRequestViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useHubRequestViewModel = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const navigate = useNavigate();

  const fetchRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const citymanagerid = user?.id || user?.citymanagerid || 1;

      const response = await apiClient.post(ENDPOINTS.HUB_REQUESTS, {
        citymanagerid: citymanagerid.toString(),
      });

      if (response.status === 200) {
        setRequests(response.data?.data || []);
        toast.success(response.data?.message || 'Requests loaded');
      }
    } catch (error) {
      toast.error('Failed to load requests');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptRequest = useCallback(async (requestId) => {
    setIsAccepting(true);
    try {
      const response = await apiClient.post(ENDPOINTS.ACCEPT_HUB_REQUEST, {
        request_id: requestId,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || 'Request accepted');
        await fetchRequests(); // Refresh list
        return true;
      } else {
        toast.error(response.data?.message || 'Failed to accept');
        return false;
      }
    } catch (error) {
      toast.error('Something went wrong');
      return false;
    } finally {
      setIsAccepting(false);
    }
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    isAccepting,
    fetchRequests,
    acceptRequest,
  };
};