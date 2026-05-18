// src/pages/hubs/HubPerformance.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Building2,
  Package,
  Clock,
  Target,
  RefreshCw,
  AlertCircle,
  Truck,
  Users,
} from 'lucide-react';
import { useHubPerformanceViewModel } from '../../hooks/HubPerformanceViewModel';
import { useNavigate } from 'react-router-dom';

const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
  white: '#FFFFFF',
};

export const HubPerformance = () => {
  const { performanceData, isLoading, error, fetchHubPerformance } = useHubPerformanceViewModel();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHubPerformance();
  }, [fetchHubPerformance]);

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
            </div>
          ))}
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
          Failed to Load Performance Data
        </h2>
        <p className="text-sm mb-4 text-center max-w-md" style={{ color: Colors.textGrey1 }}>
          {error}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchHubPerformance}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: Colors.primaryGreen }}
        >
          <RefreshCw size={16} />
          Retry
        </motion.button>
      </div>
    );
  }

  if (!performanceData) return null;

  const summary = performanceData.summary;

  // Summary Cards
  const summaryCards = [
    {
      title: 'Total Deliveries',
      value: summary?.total_deliveries || 0,
      icon: <Package size={24} />,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
    {
      title: 'Avg Success Rate',
      value: `${summary?.avg_success_rate || 0}%`,
      icon: <Target size={24} />,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    {
      title: 'Active Delivery Boys',
      value: summary?.active_delivery_boys || 0,
      icon: <Truck size={24} />,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
    },
    {
      title: 'Total Hubs',
      value: summary?.total_hubs || 0,
      icon: <Building2 size={24} />,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
    },
  ];

  // Get success rate color
  const getSuccessRateColor = (rate) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 50) return 'text-yellow-600';
    if (rate > 0) return 'text-red-600';
    return 'text-gray-400';
  };

  // Get progress bar color
  const getProgressColor = (rate) => {
    if (rate >= 80) return 'bg-green-500';
    if (rate >= 50) return 'bg-yellow-500';
    if (rate > 0) return 'bg-red-500';
    return 'bg-gray-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <TrendingUp size={24} style={{ color: Colors.primaryGreen }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
              Hub Performance
            </h1>
            <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
              Monitor and analyze hub performance metrics
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchHubPerformance}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={20} style={{ color: Colors.textGrey1 }} />
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: Colors.textGrey1 }}>
                  {card.title}
                </p>
                <p className="text-2xl font-bold mt-2" style={{ color: Colors.textBlack }}>
                  {card.value}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: card.bgColor }}
              >
                <div style={{ color: card.color }}>{card.icon}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hub Performance List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
            Hub-wise Performance
          </h2>
          <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
            Detailed performance breakdown for each hub
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Hub Name
                </th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Orders
                </th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Delivered
                </th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Avg Time
                </th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Active Boys
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {performanceData.hubs?.map((hub, index) => (
                <motion.tr
                  key={hub.hub_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-green-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/hubs/orders/${hub.hub_id}`)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                        <Building2 size={14} style={{ color: Colors.primaryGreen }} />
                      </div>
                      <span className="text-sm font-semibold capitalize" style={{ color: Colors.textBlack }}>
                        {hub.hub_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold" style={{ color: Colors.textBlack }}>
                      {hub.total_orders || 0}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold text-green-600">
                      {hub.delivered_orders || 0}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${hub.success_rate || 0}%` }}
                          className={`h-full rounded-full ${getProgressColor(hub.success_rate)}`}
                        />
                      </div>
                      <span className={`text-sm font-bold ${getSuccessRateColor(hub.success_rate)}`}>
                        {hub.success_rate || 0}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock size={14} style={{ color: Colors.textGrey1 }} />
                      <span className="text-sm" style={{ color: Colors.textBlack }}>
                        {hub.avg_delivery_time || 0} min
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users size={14} style={{ color: Colors.textGrey1 }} />
                      <span className="text-sm font-semibold" style={{ color: Colors.textBlack }}>
                        {hub.active_boys || 0}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!performanceData.hubs || performanceData.hubs.length === 0) && (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No hub performance data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};