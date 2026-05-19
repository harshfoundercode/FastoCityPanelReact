// src/hooks/useBulkTransferViewModel.js
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useBulkTransferViewModel = () => {
  const [hubs, setHubs] = useState([]);
  const [isLoadingHubs, setIsLoadingHubs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch hubs list
  const fetchHubs = useCallback(async () => {
    setIsLoadingHubs(true);
    try {
      const response = await apiClient.get(ENDPOINTS.HUB_LIST);
      if (response.status === 200) {
        const hubList = response.data?.data?.hubs || response.data?.data || [];
        setHubs(hubList);
      }
    } catch (error) {
      toast.error('Failed to load hubs');
    } finally {
      setIsLoadingHubs(false);
    }
  }, []);

  // Submit admin request
  const submitAdminRequest = useCallback(async (items, remarks) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post(ENDPOINTS.CITY_REQUEST, {
        items: items,
        remarks: remarks || '',
      });
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || 'Request sent successfully');
        return true;
      } else {
        toast.error(response.data?.message || 'Request failed');
        return false;
      }
    } catch (error) {
      toast.error('Something went wrong');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Submit hub transfer
  const submitHubTransfer = useCallback(async (hubManagerId, items, remarks) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post(ENDPOINTS.CITY_TRANSFER_TO_HUB, {
        hubmanagerid: hubManagerId,
        remarks: remarks || '',
        items: items,
      });
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || 'Transfer successful');
        return true;
      } else {
        toast.error(response.data?.message || 'Transfer failed');
        return false;
      }
    } catch (error) {
      toast.error('Something went wrong');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    hubs,
    isLoadingHubs,
    isSubmitting,
    fetchHubs,
    submitAdminRequest,
    submitHubTransfer,
  };
};