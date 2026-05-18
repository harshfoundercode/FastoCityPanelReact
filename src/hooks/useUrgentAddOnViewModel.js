// src/hooks/useUrgentAddOnViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useUrgentAddOnViewModel = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch main categories
  const fetchMainCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(ENDPOINTS.URGENT_MAIN_CATEGORIES);
      if (response.status === 200) {
        setMainCategories(response.data?.data || []);
        return response.data?.data;
      }
    } catch (error) {
      toast.error('Failed to load categories');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch categories by main category ID
  const fetchCategoriesByMainCat = useCallback(async (mainCatId) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(ENDPOINTS.URGENT_CATEGORIES_BY_MAIN, {
        maincatid: mainCatId,
      });
      if (response.status === 200) {
        setCategoryData(response.data?.data || []);
        return response.data?.data;
      }
    } catch (error) {
      toast.error('Failed to load sub-categories');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit add-on inventory request
  const submitAddOnRequest = useCallback(async (items) => {
    setIsSubmitting(true);
    try {
      const payload = {
        items: items,
        remarks: "Stock needed urgently",
      };
      const response = await apiClient.post(ENDPOINTS.URGENT_ADD_ON_REQUEST, payload);
      
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || 'Request successful');
        navigate('/dashboard', { replace: true });
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
  }, [navigate]);

  return {
    mainCategories,
    categoryData,
    isLoading,
    isSubmitting,
    fetchMainCategories,
    fetchCategoriesByMainCat,
    submitAddOnRequest,
  };
};