// src/hooks/useOrdersViewModel.js
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useOrdersViewModel = () => {
    const [ordersData, setOrdersData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = useCallback(async (type = 'all') => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('📦 Fetching orders...');

            const citymanagerid = JSON.parse(localStorage.getItem('user') || '{}')?.citymanagerid ||
                JSON.parse(localStorage.getItem('user') || '{}')?.id || 1;

            const response = await apiClient.post(ENDPOINTS.ALL_ORDERS, {
                citymanagerid: citymanagerid.toString(),
            });

            console.log('✅ ORDERS FULL RESPONSE =>', response);
            console.log('✅ ORDERS DATA =>', response.data);
            console.log('✅ STATUS =>', response.status);

            if (response.status === 200) {
                const data = response.data?.data;
                setOrdersData(data);

                console.log('📦 TOTAL ORDERS =>', data?.total);
                console.log('📦 ORDERS LIST =>', data?.orders?.length);

                toast.success(response.data?.message || 'Orders loaded');
                return data;
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            console.log('❌ ORDERS ERROR =>', error);

            let errorMessage = 'Failed to load orders';

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
        fetchOrders,
    };
};