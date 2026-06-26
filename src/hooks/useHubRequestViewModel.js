// src/hooks/useHubRequestViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useHubRequestViewModel = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
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

   // Reject request function
  const rejectRequest = useCallback(async (requestId,rejectReason) => {
    setIsRejecting(true);
    try {
      const response = await apiClient.post(ENDPOINTS.REJECT_HUB_REQUEST, {
        request_id: requestId,
       reject_reason: rejectReason
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || 'Request rejected');
        await fetchRequests(); // Refresh list
        return true;
      } else {
        toast.error(response.data?.message || 'Failed to reject');
        return false;
      }
    } catch (error) {
      toast.error('Something went wrong');
      return false;
    } finally {
      setIsRejecting(false);
    }
  }, [fetchRequests]);

  // Transfer stock to hub function
  const transferStockToHub = useCallback(async (requestId, hubManagerId, items) => {
    setIsTransferring(true);
    try {
      const response = await apiClient.post(ENDPOINTS.CITY_TRANSFER_TO_HUB, {
        requestid: requestId,
        hubmanagerid: hubManagerId,
        items: items,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || 'Stock transferred to hub successfully');
        await fetchRequests(); // Refresh list to update status
        return true;
      } else {
        toast.error(response.data?.message || 'Failed to transfer stock');
        return false;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong while transferring stock');
      console.error(error);
      return false;
    } finally {
      setIsTransferring(false);
    }
  }, [fetchRequests]);

  return {
    requests,
    isLoading,
    isAccepting,
    isRejecting,
    isTransferring,
    fetchRequests,
    acceptRequest,
    rejectRequest,
    transferStockToHub, 
  };
};