// src/hooks/useDashboardViewModel.js

import { useState, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';

import apiClient, {
  ENDPOINTS
} from '../config/ApiConfig';

export const useDashboardViewModel = () => {

  // STATES
  const [dashboardData, setDashboardData] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const navigate = useNavigate();

  // FETCH DASHBOARD
  const fetchDashboard = useCallback(
    async () => {

      setIsLoading(true);

      setError(null);

      try {

        console.log(
          "📊 Fetching dashboard..."
        );

        // API CALL
        const response =
          await apiClient.get(
            ENDPOINTS.DASHBOARD
          );

        console.log(
          "✅ FULL DASHBOARD RESPONSE =>",
          response
        );

        console.log(
          "✅ RESPONSE DATA =>",
          response.data
        );

        console.log(
          "✅ STATUS =>",
          response.status
        );

        // SUCCESS
        if (response.status === 200) {

          // ACTUAL DATA
          const dashboard =
            response.data?.data;

          // SAVE DATA
          setDashboardData(
            dashboard
          );

          // PRINT
          console.log(
            "📊 DASHBOARD DATA =>",
            dashboard
          );

          toast.success(
            response.data?.message ||
            "Dashboard loaded"
          );

          return dashboard;

        } else {

          throw new Error(
            "Invalid response"
          );

        }

      } catch (error) {

        console.log(
          "❌ DASHBOARD ERROR =>",
          error
        );

        let errorMessage =
          "Failed to load dashboard";

        // API ERROR
        if (error.response) {

          console.log(
            "❌ ERROR STATUS =>",
            error.response.status
          );

          console.log(
            "❌ ERROR DATA =>",
            error.response.data
          );

          const status =
            error.response.status;

          switch (status) {

            case 401:

              errorMessage =
                "Session expired";

              // CLEAR STORAGE
              localStorage.removeItem(
                "token"
              );

              localStorage.removeItem(
                "user"
              );

              // REDIRECT
              navigate(
                "/login",
                {
                  replace: true,
                }
              );

              break;

            case 403:

              errorMessage =
                "Access denied";

              break;

            case 404:

              errorMessage =
                "Dashboard not found";

              break;

            case 500:

              errorMessage =
                "Server error";

              break;

            default:

              errorMessage =
                error.response.data?.message ||
                errorMessage;
          }

        }
        // NETWORK ERROR
        else if (error.request) {

          errorMessage =
            "Network error";

        }
        // OTHER ERROR
        else {

          errorMessage =
            error.message;

        }

        setError(errorMessage);

        toast.error(errorMessage);

        return null;

      } finally {

        setIsLoading(false);

      }

    },
    [navigate]
  );

  return {

    dashboardData,

    isLoading,

    error,

    fetchDashboard,

  };
};