// src/services/ApiService.js
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

// ─────────────────────────────────────────────────────────────────────────────
// HUB SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export const HubService = {
  // Get hub zone list by city zone ID
  getHubZoneList: async (cityzoneid) => {
    try {
      const response = await apiClient.post(ENDPOINTS.HUB_ZONE_LIST, {
        cityzoneid,
      });
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch hub zones',
        status: error.response?.status,
      };
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HUB MANAGER SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export const HubManagerService = {
  // Create hub manager
  createManager: async (managerData) => {
    try {
      const response = await apiClient.post(ENDPOINTS.HUB_MANAGER_CREATE, managerData);
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message || 'Manager created successfully',
      };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create manager',
        errors: error.response?.data?.errors,
        status: error.response?.status,
      };
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export const UploadService = {
  // Upload image to Cloudinary
  uploadToCloudinary: async (file) => {
   
    const CLOUD_NAME = "ddsnwfgaw";
    const UPLOAD_PRESET = "FastoDriver";

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.secure_url) {
        return {
          success: true,
          url: data.secure_url,
        };
      } else {
        return {
          success: false,
          message: data.error?.message || 'Upload failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error during upload',
      };
    }
  },
};