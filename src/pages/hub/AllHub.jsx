// src/pages/hubs/AllHubs.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  MapPin,
  Users,
  Truck,
  Package,
  CheckCircle,
  Clock,
  Phone,
  User,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  AlertCircle,
  Eye,
  Edit,
  Star,
  Navigation,
  IndianRupee,
  ArrowUpRight,
} from 'lucide-react';

// Color constants matching Flutter
const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
  white: '#FFFFFF',
};

// Mock data matching API response
const mockHubData = {
  summary: {
    total_hubs: 4,
    active_hubs: "4",
    total_delivery_boys: 3,
    total_active_orders: 3
  },
  hubs: [
    {
      hub_id: 5,
      hub_name: "Tedhi pulia hub",
      address: "Chauraha Tedhi Pulia Ring Road, Vikas Nagar, Lucknow, Uttar Pradesh, 226022",
      manager_name: "Amit Kumar",
      manager_phone: "9876843210",
      status: 1,
      delivery_boys: 0,
      active_orders: 0,
      completed_orders: 0
    },
    {
      hub_id: 4,
      hub_name: "chidiyaghar hub",
      address: "Kamta, Lucknow, Uttar Pradesh, 226028",
      manager_name: "abhishek shrma",
      manager_phone: "1234568900",
      status: 1,
      delivery_boys: 2,
      active_orders: 0,
      completed_orders: 0
    },
    {
      hub_id: 2,
      hub_name: "Telibagh Hub",
      address: "Telibagh, Lucknow, Uttar Pradesh, 226002",
      manager_name: "tuba shrma",
      manager_phone: "3523741274",
      status: 1,
      delivery_boys: 0,
      active_orders: 0,
      completed_orders: 0
    },
    {
      hub_id: 1,
      hub_name: "Foundercode Hub",
      address: "Jankipuram Extension, Malookpur, Uttar Pradesh, 226031",
      manager_name: "raunit naryan",
      manager_phone: "8840958016",
      status: 1,
      delivery_boys: 1,
      active_orders: 3,
      completed_orders: 9
    }
  ]
};

export const AllHubs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedHub, setExpandedHub] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const hubData = mockHubData;

  // Filter hubs based on search and status
  const filteredHubs = useMemo(() => {
    return hubData.hubs.filter(hub => {
      const matchesSearch = 
        hub.hub_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hub.manager_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hub.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && hub.status === 1) ||
        (statusFilter === 'inactive' && hub.status === 0);

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Summary cards data
  const summaryCards = [
    {
      title: 'Total Hubs',
      value: hubData.summary.total_hubs,
      icon: <Building2 size={24} />,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      subtext: 'All hubs',
    },
    {
      title: 'Active Hubs',
      value: hubData.summary.active_hubs,
      icon: <CheckCircle size={24} />,
      color: '#10B981',
      bgColor: '#ECFDF5',
      subtext: 'Currently active',
    },
    {
      title: 'Delivery Boys',
      value: hubData.summary.total_delivery_boys,
      icon: <Truck size={24} />,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      subtext: 'Total riders',
    },
    {
      title: 'Active Orders',
      value: hubData.summary.total_active_orders,
      icon: <Package size={24} />,
      color: '#8B5CF6',
      bgColor: '#F5F3FF',
      subtext: 'In progress',
    },
  ];

  // Toggle hub details
  const toggleHubDetails = (hubId) => {
    setExpandedHub(expandedHub === hubId ? null : hubId);
  };

  // Format phone number
  const formatPhone = (phone) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '+91 $1-$2-$3');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: Colors.primaryExtraLightGreen }}
              >
                <Building2 size={24} style={{ color: Colors.primaryGreen }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
                  All Hubs
                </h1>
                <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
                  Manage and monitor all your hubs
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: Colors.textGrey1 }}
              />
              <input
                type="text"
                placeholder="Search hubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : ''
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="6" rx="1" />
                  <rect x="9" y="1" width="6" height="6" rx="1" />
                  <rect x="1" y="9" width="6" height="6" rx="1" />
                  <rect x="9" y="9" width="6" height="6" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : ''
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="2" width="14" height="3" rx="1" />
                  <rect x="1" y="7" width="14" height="3" rx="1" />
                  <rect x="1" y="12" width="14" height="3" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex gap-2 mt-4">
          {[
            { id: 'all', label: 'All Hubs', count: hubData.summary.total_hubs },
            { id: 'active', label: 'Active', count: hubData.summary.active_hubs },
            { id: 'inactive', label: 'Inactive', count: 0 },
          ].map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatusFilter(filter.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: statusFilter === filter.id 
                  ? Colors.primaryExtraLightGreen 
                  : Colors.containerGrey2,
                color: statusFilter === filter.id 
                  ? Colors.primaryGreen 
                  : Colors.textGrey1,
              }}
            >
              {filter.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={{
                  backgroundColor: statusFilter === filter.id 
                    ? Colors.primaryGreen 
                    : '#D1D5DB',
                  color: 'white',
                }}
              >
                {filter.count}
              </span>
            </motion.button>
          ))}
        </div>
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
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: Colors.textGrey1 }}>
                  {card.title}
                </p>
                <p className="text-2xl font-bold mt-1" style={{ color: Colors.textBlack }}>
                  {card.value}
                </p>
                <p className="text-xs mt-1" style={{ color: Colors.textGrey1 }}>
                  {card.subtext}
                </p>
              </div>
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: card.bgColor }}
              >
                <div style={{ color: card.color }}>{card.icon}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hubs List/Grid */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
          : 'space-y-4'
      }>
        <AnimatePresence>
          {filteredHubs.map((hub, index) => (
            <motion.div
              key={hub.hub_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              layout
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Hub Card Header */}
              <div 
                className="p-5 cursor-pointer"
                onClick={() => toggleHubDetails(hub.hub_id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 
                        className="text-lg font-semibold capitalize"
                        style={{ color: Colors.textBlack }}
                      >
                        {hub.hub_name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          hub.status === 1 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {hub.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2">
                      <MapPin size={14} style={{ color: Colors.textGrey1 }} />
                      <p 
                        className="text-sm truncate"
                        style={{ color: Colors.textGrey1 }}
                      >
                        {hub.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      <User size={14} style={{ color: Colors.textGrey1 }} />
                      <p 
                        className="text-sm capitalize"
                        style={{ color: Colors.textGrey1 }}
                      >
                        {hub.manager_name}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: expandedHub === hub.hub_id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-2"
                  >
                    <ChevronDown size={20} style={{ color: Colors.textGrey1 }} />
                  </motion.div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-2 rounded-lg bg-blue-50">
                    <Truck size={16} className="mx-auto mb-1" style={{ color: '#3B82F6' }} />
                    <p className="text-lg font-bold" style={{ color: Colors.textBlack }}>
                      {hub.delivery_boys}
                    </p>
                    <p className="text-xs" style={{ color: Colors.textGrey1 }}>Riders</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-orange-50">
                    <Clock size={16} className="mx-auto mb-1" style={{ color: '#F59E0B' }} />
                    <p className="text-lg font-bold" style={{ color: Colors.textBlack }}>
                      {hub.active_orders}
                    </p>
                    <p className="text-xs" style={{ color: Colors.textGrey1 }}>Active</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-green-50">
                    <CheckCircle size={16} className="mx-auto mb-1" style={{ color: '#10B981' }} />
                    <p className="text-lg font-bold" style={{ color: Colors.textBlack }}>
                      {hub.completed_orders}
                    </p>
                    <p className="text-xs" style={{ color: Colors.textGrey1 }}>Completed</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedHub === hub.hub_id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="px-5 pb-5 border-t"
                      style={{ borderColor: Colors.containerGrey2 }}
                    >
                      <div className="pt-4 space-y-3">
                        {/* Full Address */}
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: Colors.primaryExtraLightGreen }}
                          >
                            <MapPin size={14} style={{ color: Colors.primaryGreen }} />
                          </div>
                          <div>
                            <p className="text-xs font-medium" style={{ color: Colors.textBlack }}>
                              Full Address
                            </p>
                            <p className="text-sm mt-0.5" style={{ color: Colors.textGrey1 }}>
                              {hub.address}
                            </p>
                          </div>
                        </div>

                        {/* Manager Details */}
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: Colors.primaryExtraLightGreen }}
                          >
                            <User size={14} style={{ color: Colors.primaryGreen }} />
                          </div>
                          <div>
                            <p className="text-xs font-medium" style={{ color: Colors.textBlack }}>
                              Manager Details
                            </p>
                            <p className="text-sm mt-0.5 capitalize" style={{ color: Colors.textGrey1 }}>
                              {hub.manager_name}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Phone size={12} style={{ color: Colors.textGrey1 }} />
                              <p className="text-sm" style={{ color: Colors.textGrey1 }}>
                                {formatPhone(hub.manager_phone)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Performance Stats */}
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: Colors.primaryExtraLightGreen }}
                          >
                            <TrendingUp size={14} style={{ color: Colors.primaryGreen }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium" style={{ color: Colors.textBlack }}>
                              Performance
                            </p>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs" style={{ color: Colors.textGrey1 }}>Total Orders</p>
                                <p className="text-sm font-bold" style={{ color: Colors.textBlack }}>
                                  {hub.active_orders + hub.completed_orders}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-2 text-center">
                                <p className="text-xs" style={{ color: Colors.textGrey1 }}>Completion Rate</p>
                                <p className="text-sm font-bold" style={{ color: Colors.primaryGreen }}>
                                  {hub.active_orders + hub.completed_orders > 0
                                    ? Math.round((hub.completed_orders / (hub.active_orders + hub.completed_orders)) * 100)
                                    : 0}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium"
                            style={{
                              backgroundColor: Colors.primaryExtraLightGreen,
                              color: Colors.primaryGreen,
                            }}
                          >
                            <Eye size={16} />
                            View Details
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-white"
                            style={{
                              backgroundColor: Colors.primaryGreen,
                            }}
                          >
                            <Edit size={16} />
                            Edit Hub
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredHubs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Building2 size={48} className="mx-auto mb-4" style={{ color: '#D1D5DB' }} />
            <p className="text-lg font-medium" style={{ color: Colors.textBlack }}>
              No hubs found
            </p>
            <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
              Try adjusting your search or filter
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};