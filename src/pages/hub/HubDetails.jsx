// src/pages/hubs/HubDetails.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Building2,
  TrendingUp,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  AlertCircle,
  Star,
  Navigation,
  RefreshCw,
} from 'lucide-react';
import { useHubDetailsViewModel } from '../../hooks/HubDetailsViewModel';

const Colors = {
  primaryGreen: '#14532D',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
};

export const HubDetails = () => {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const { hubDetails, isLoading, error, fetchHubDetails } = useHubDetailsViewModel();

  useEffect(() => {
    if (hubId) {
      fetchHubDetails(hubId);
    }
  }, [hubId, fetchHubDetails]);

  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '+91 $1-$2-$3');
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle size={32} style={{ color: '#DC2626' }} />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: Colors.textBlack }}>
          Failed to Load Hub Details
        </h2>
        <p className="text-sm mb-4" style={{ color: Colors.textGrey1 }}>
          {error}
        </p>
        <button
          onClick={() => fetchHubDetails(hubId)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: Colors.primaryGreen }}
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!hubDetails) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/hubs/all-hubs')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors"
          style={{ color: Colors.textBlack }}
        >
          <ArrowLeft size={18} />
          Back to Hubs
        </motion.button>
      </div>

      {/* Hub Header */}
      <div className="bg-gradient-to-br from-[#166534] to-[#14532D] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={20} className="text-white/80" />
              <h1 className="text-2xl font-bold capitalize">
                {hubDetails.hub?.hub_name}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin size={16} />
              <p className="text-sm">{hubDetails.hub?.city_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Information & Manager Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hub Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-700" />
            <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
              Hub Information
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <Building2 size={18} style={{ color: Colors.primaryGreen }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Hub Name</p>
                <p className="text-sm font-semibold capitalize" style={{ color: Colors.textBlack }}>
                  {hubDetails.hub?.hub_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Navigation size={18} style={{ color: '#3B82F6' }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">City</p>
                <p className="text-sm font-semibold capitalize" style={{ color: Colors.textBlack }}>
                  {hubDetails.hub?.city_name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Full Address</p>
                <p className="text-sm font-semibold" style={{ color: Colors.textBlack }}>
                  {hubDetails.hub?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Manager Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-700" />
            <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
              Manager Details
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <User size={24} style={{ color: '#8B5CF6' }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Manager Name</p>
                <p className="text-base font-semibold capitalize" style={{ color: Colors.textBlack }}>
                  {hubDetails.hub?.manager_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Phone size={24} style={{ color: Colors.primaryGreen }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone Number</p>
                <p className="text-base font-semibold" style={{ color: Colors.textBlack }}>
                  {formatPhone(hubDetails.hub?.manager_phone)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 rounded-full bg-green-700" />
          <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
            Performance Metrics
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Orders */}
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <Package size={24} className="mx-auto mb-2" style={{ color: '#3B82F6' }} />
            <p className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
              {hubDetails.performance?.total_orders || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Orders</p>
          </div>

          {/* Completed */}
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <CheckCircle size={24} className="mx-auto mb-2" style={{ color: '#10B981' }} />
            <p className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
              {hubDetails.performance?.completed_deliveries || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>

          {/* Cancelled */}
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <XCircle size={24} className="mx-auto mb-2" style={{ color: '#DC2626' }} />
            <p className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
              {hubDetails.performance?.cancelled_orders || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Cancelled</p>
          </div>

          {/* Success Rate */}
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <TrendingUp size={24} className="mx-auto mb-2" style={{ color: '#8B5CF6' }} />
            <p className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
              {hubDetails.performance?.success_rate 
                ? `${hubDetails.performance.success_rate}%` 
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Success Rate</p>
          </div>

          {/* Avg Time */}
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <Clock size={24} className="mx-auto mb-2" style={{ color: '#F59E0B' }} />
            <p className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
              {hubDetails.performance?.avg_delivery_time 
                ? `${hubDetails.performance.avg_delivery_time}m` 
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Avg Time</p>
          </div>

          {/* Cancel Rate */}
          <div className="bg-pink-50 rounded-xl p-4 text-center">
            <AlertCircle size={24} className="mx-auto mb-2" style={{ color: '#EC4899' }} />
            <p className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
              {hubDetails.performance?.cancellation_rate 
                ? `${hubDetails.performance.cancellation_rate}%` 
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Cancel Rate</p>
          </div>
        </div>
      </div>

      {/* Delivery Boys & Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Boys */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-700" />
            <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
              Delivery Boys
            </h2>
          </div>

          <div className="flex items-center justify-between p-6 bg-purple-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Truck size={32} style={{ color: '#8B5CF6' }} />
              </div>
              <div>
                <p className="text-3xl font-bold" style={{ color: Colors.textBlack }}>
                  {hubDetails.drivers?.total_delivery_boys || 0}
                </p>
                <p className="text-sm text-gray-500">Total Delivery Boys</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold" style={{ color: Colors.primaryGreen }}>
                {hubDetails.drivers?.active_boys || 0}
              </p>
              <p className="text-sm text-gray-500">Active Now</p>
            </div>
          </div>
        </div>

        {/* Top Delivery Boys */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-700" />
            <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
              Top Delivery Boys
            </h2>
          </div>

          {hubDetails.top_delivery_boys && hubDetails.top_delivery_boys.length > 0 ? (
            <div className="space-y-3">
              {hubDetails.top_delivery_boys.map((boy, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Star size={18} style={{ color: '#F59E0B' }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold capitalize" style={{ color: Colors.textBlack }}>
                      {boy.name || 'Delivery Boy'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {boy.completed_orders || 0} deliveries completed
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Star size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No top delivery boys yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Disruptions */}
      {hubDetails.recent_disruptions && hubDetails.recent_disruptions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-red-500" />
            <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
              Recent Disruptions
            </h2>
          </div>

          <div className="space-y-3">
            {hubDetails.recent_disruptions.map((disruption, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={20} style={{ color: '#DC2626' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: Colors.textBlack }}>
                  {disruption.description || 'Disruption reported'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};