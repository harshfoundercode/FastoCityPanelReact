// src/hooks/useProfileViewModel.js

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

export const useProfileViewModel = () => {

  const [profileData, setProfileData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {

    setIsLoading(true);

    setError(null);

    try {

      // API CALL
      const response = await apiClient.get(ENDPOINTS.PROFILE);

      console.log("PROFILE FULL RESPONSE =>", response);

      console.log("PROFILE RESPONSE DATA =>", response.data);

      console.log("PROFILE STATUS =>",response.status);

      // SUCCESS
      if (response.status === 200) {

        // ACTUAL PROFILE DATA
        const profile =response.data?.data;

        // SAVE STATE
        setProfileData(profile);

        // PRINT
        console.log( "PROFILE DATA =>", profile );

        console.log(
          "PROFILE NAME =>",
          profile?.name
        );

        console.log(
          "PROFILE EMAIL =>",
          profile?.email
        );

        console.log(
          "PROFILE PHONE =>",
          profile?.phone
        );

        toast.success(
          response.data?.message || "Profile fetched successfully" );

        return profile;

      } else {

        throw new Error(
          "Invalid response"
        );

      }

    } catch (error) {

      console.log(
        "PROFILE ERROR =>",
        error
      );

      let errorMessage =
        "Failed to fetch profile";

      // API ERROR
      if (error.response) {

        console.log(
          "ERROR STATUS =>",
          error.response.status
        );

        console.log(
          "ERROR DATA =>",
          error.response.data
        );

        const status =
          error.response.status;

        const message =
          error.response.data?.message;

        switch (status) {

          case 401:
            errorMessage =
              "Session expired. Please login again";
            break;

          case 404:
            errorMessage =
              "Profile not found";
            break;

          case 500:
            errorMessage =
              "Server error";
            break;

          default:
            errorMessage =
              message ||
              "Failed to fetch profile";
        }

      }
      // NETWORK ERROR
      else if (error.request) {

        errorMessage =
          "Network error. Check internet";

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

  }, []);

  return {

    profileData,

    isLoading,

    error,

    fetchProfile,

  };
};