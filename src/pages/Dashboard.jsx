import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingCart, Users, TrendingUp, DollarSign, AlertCircle, MapPin, Truck, CheckCircle, Clock, Building2, IndianRupee, ChevronRight, RefreshCw, Loader } from 'lucide-react';
import { useDashboardViewModel } from '../hooks/DashboardViewModel';

const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
  white: '#FFFFFF',
};

export const Dashboard = () => {
  const {
    dashboardData,
    isLoading,
    error,
    fetchDashboard
  } = useDashboardViewModel();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Welcome Section Skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>

        {/* Order Progress Skeleton */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
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
          Failed to Load Dashboard
        </h2>
        <p className="text-sm mb-4" style={{ color: Colors.textGrey1 }}>
          {error}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchDashboard}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: Colors.primaryGreen }}
        >
          <RefreshCw size={16} />
          Retry
        </motion.button>
      </div>
    );
  }

  // If no data yet or summary is missing
  if (!dashboardData || !dashboardData.summary) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
          <AlertCircle size={32} style={{ color: '#D97706' }} />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: Colors.textBlack }}>
          No Data Available
        </h2>
        <p className="text-sm mb-4" style={{ color: Colors.textGrey1 }}>
          Unable to load dashboard data. Please try again.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchDashboard}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: Colors.primaryGreen }}
        >
          <RefreshCw size={16} />
          Retry
        </motion.button>
      </div>
    );
  }

  // Safe defaults for summary values
  const summary = dashboardData.summary || {
    total_orders: 0,
    active_orders: 0,
    delivered_orders: 0,
    pending_orders: 0,
    total_hubs: 0,
    revenue: 0,
    delivery_boys: 0,
    city_name: 'Unknown City'
  };

  // Calculate order completion percentage
  const completionRate = summary.total_orders > 0
    ? ((summary.delivered_orders / summary.total_orders) * 100).toFixed(1)
    : 0;

  // Stats cards configuration with safe fallbacks
  const statsCards = [
    {
      title: 'Total Orders',
      value: summary.total_orders || 0,
      subValue: `${summary.active_orders || 0} Active`,
      icon: <ShoppingCart size={24} />,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      trend: `${completionRate}% Delivered`,
    },
    {
      title: 'Active Hubs',
      value: summary.total_hubs || 0,
      subValue: `${dashboardData.hubs?.filter(h => h.status === 0).length || 0} Active`,
      icon: <Building2 size={24} />,
      color: '#10B981',
      bgColor: '#ECFDF5',
      trend: 'Currently Operating',
    },
    {
      title: 'Total Revenue',
      value: `₹${summary.revenue || 0}`,
      subValue: 'This Month',
      icon: <IndianRupee size={24} />,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      trend: '↗ Growing',
    },
    {
      title: 'Delivery Boys',
      value: summary.delivery_boys || 0,
      subValue: 'Active Riders',
      icon: <Truck size={24} />,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      trend: 'On Duty',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & City Info Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={20} style={{ color: Colors.primaryGreen }} />
              <h1 className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
                {summary.city_name || 'Unknown City'}
              </h1>
            </div>
            <p className="mt-1" style={{ color: Colors.textGrey1 }}>
              Welcome back, Admin! 👋 Here's your city overview.
            </p>
          </div>
          <div className="flex gap-2">
            <div
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: Colors.primaryExtraLightGreen,
                color: Colors.primaryGreen,
              }}
            >
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchDashboard}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh Dashboard"
            >
              <RefreshCw size={18} style={{ color: Colors.textGrey1 }} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: Colors.textGrey1 }}>
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-2" style={{ color: Colors.textBlack }}>
                  {stat.value}
                </p>
                <p className="text-xs mt-1" style={{ color: Colors.textGrey1 }}>
                  {stat.subValue}
                </p>
              </div>
              <div
                className="p-3 rounded-lg shrink-0"
                style={{ backgroundColor: stat.bgColor }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
            </div>
            <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium ml-2" style={{ color: Colors.textGrey1 }}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Transfers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: Colors.textBlack }}>
          Transfers Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="text-center p-4 rounded-xl bg-purple-50">
            <p className="text-2xl font-bold text-purple-600">{summary.total_transfers || 0}</p>
            <p className="text-xs mt-1 text-gray-600">Total Transfers</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-blue-50">
            <p className="text-2xl font-bold text-blue-600">{summary.approved_transfers || 0}</p>
            <p className="text-xs mt-1 text-gray-600">Approved</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-green-50">
            <p className="text-2xl font-bold text-green-600">{summary.completed_transfers || 0}</p>
            <p className="text-xs mt-1 text-gray-600">Completed</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-yellow-50">
            <p className="text-2xl font-bold text-yellow-600">{summary.pending_transfers || 0}</p>
            <p className="text-xs mt-1 text-gray-600">Pending</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-red-50">
            <p className="text-2xl font-bold text-red-600">{summary.cancelled_transfers || 0}</p>
            <p className="text-xs mt-1 text-gray-600">Cancelled</p>
          </div>
        </div>
      </motion.div>

      {/* Order Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold mb-4" style={{ color: Colors.textBlack }}>
          Order Progress
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-blue-50">
            <p className="text-2xl font-bold text-blue-600">{summary.total_orders || 0}</p>
            <p className="text-xs mt-1 text-gray-600">Total Orders</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-green-50">
            <p className="text-2xl font-bold text-green-600">{summary.delivered_orders || 0}</p>
            <p className="text-xs mt-1 text-gray-600">Delivered</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-orange-50">
            <p className="text-2xl font-bold text-orange-600">{summary.active_orders || 0}</p>
            <p className="text-xs mt-1 text-gray-600">In Progress</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-red-50">
            <p className="text-2xl font-bold text-red-600">{summary.pending_orders || 0}</p>
            <p className="text-xs mt-1 text-gray-600">Pending</p>
          </div>
        </div>
      </motion.div>

      {/* Hubs Section */}
      {dashboardData.hubs && dashboardData.hubs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold" style={{ color: Colors.textBlack }}>
              Hubs Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.hubs.map((hub) => (
              <motion.div
                key={hub.hub_id}
                whileHover={{ y: -2 }}
                className="p-4 rounded-xl border border-gray-200 bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm capitalize" style={{ color: Colors.textBlack }}>
                      {hub.hub_name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={12} style={{ color: Colors.textGrey1 }} />
                      <p className="text-xs truncate" style={{ color: Colors.textGrey1 }}>
                        {hub.address?.split(',')[0]}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${hub.status === 1
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {hub.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <p className="text-sm font-bold" style={{ color: Colors.textBlack }}>
                      {hub.delivery_boys || 0}
                    </p>
                    <p className="text-xs" style={{ color: Colors.textGrey1 }}>Riders</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <p className="text-sm font-bold" style={{ color: Colors.textBlack }}>
                      {hub.in_progress || 0}
                    </p>
                    <p className="text-xs" style={{ color: Colors.textGrey1 }}>In Progress</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <p className="text-sm font-bold" style={{ color: Colors.textBlack }}>
                      {hub.completed_today || 0}
                    </p>
                    <p className="text-xs" style={{ color: Colors.textGrey1 }}>Completed</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-50">
                    <p className="text-sm font-bold" style={{ color: Colors.primaryGreen }}>
                      ₹{hub.revenue || 0}
                    </p>
                    <p className="text-xs" style={{ color: Colors.textGrey1 }}>Revenue</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Revenue & Disputes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: Colors.textBlack }}>
            Revenue History
          </h2>
          <div className="space-y-3">
            {dashboardData.revenue_chart?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: Colors.primaryExtraLightGreen }}
                  >
                    <span
                      style={{
                        color: Colors.primaryGreen,
                        fontSize: 18,
                        fontWeight: "bold",
                        lineHeight: 1,
                      }}
                    >
                      ₹
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: Colors.textBlack }}>
                      {formatDate(item.day)}
                    </p>
                    <p className="text-xs" style={{ color: Colors.textGrey1 }}>
                      Daily Revenue
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold" style={{ color: Colors.primaryGreen }}>
                  ₹{item.revenue}
                </p>
              </div>
            ))}
            {(!dashboardData.revenue_chart || dashboardData.revenue_chart.length === 0) && (
              <p className="text-center text-gray-500 py-4">No revenue data available</p>
            )}
          </div>
        </motion.div>

        {/* Recent Disputes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: Colors.textBlack }}>
              Recent Disputes
            </h2>
          </div>

          <div className="space-y-3">
            {dashboardData.recent_disputes?.map((dispute, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle size={18} style={{ color: '#DC2626' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: Colors.textBlack }}>
                    {dispute.order_no}
                  </p>
                  <p className="text-xs mt-1" style={{ color: Colors.textGrey1 }}>
                    Amount: ₹{dispute.final_amount}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"
                  >
                    Dispute
                  </span>
                  <p className="text-xs mt-1" style={{ color: Colors.textGrey1 }}>
                    {formatDate(dispute.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
            {(!dashboardData.recent_disputes || dashboardData.recent_disputes.length === 0) && (
              <p className="text-center text-gray-500 py-4">No disputes found</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};