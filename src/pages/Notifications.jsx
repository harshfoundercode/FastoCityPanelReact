// src/pages/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Package,
  ShoppingCart,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  DollarSign,
  Truck,
  ChevronRight,
  Calendar,
  Filter,
  Search,
  RefreshCw,
} from 'lucide-react';

const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
  white: '#FFFFFF',
};

// Dummy notification data matching the API structure
const dummyNotifications = {
  count: 8,
  notifications: {
    today: [
      {
        id: 1,
        type: 'order',
        title: 'New Order Received',
        message: 'Order #ORD767817 has been placed by Customer from Aliganj area',
        time: '2 hours ago',
        timestamp: '2026-05-16T10:30:00',
        icon: <ShoppingCart size={18} />,
        color: '#3B82F6',
        bgColor: '#EFF6FF',
        isRead: false,
        action: 'View Order',
        link: '/orders',
      },
      {
        id: 2,
        type: 'hub',
        title: 'Hub Stock Alert',
        message: 'Foundercode Hub is running low on vegetables inventory',
        time: '4 hours ago',
        timestamp: '2026-05-16T08:15:00',
        icon: <Package size={18} />,
        color: '#F59E0B',
        bgColor: '#FFFBEB',
        isRead: false,
        action: 'Check Inventory',
        link: '/city-stocks',
      },
      {
        id: 3,
        type: 'delivery',
        title: 'Delivery Completed',
        message: 'Order #ORD767815 has been delivered successfully by Rahul Kumar',
        time: '5 hours ago',
        timestamp: '2026-05-16T07:45:00',
        icon: <CheckCircle size={18} />,
        color: '#10B981',
        bgColor: '#ECFDF5',
        isRead: true,
        action: 'View Details',
        link: '/orders',
      },
      {
        id: 4,
        type: 'revenue',
        title: 'Daily Revenue Report',
        message: 'Today\'s revenue reached ₹2,450.00 from 15 orders',
        time: '6 hours ago',
        timestamp: '2026-05-16T06:00:00',
        icon: <DollarSign size={18} />,
        color: '#8B5CF6',
        bgColor: '#F5F3FF',
        isRead: true,
        action: 'View Report',
        link: '/dashboard',
      },
    ],
    yesterday: [
      {
        id: 5,
        type: 'hub',
        title: 'New Hub Manager Assigned',
        message: 'John Doe has been assigned as manager for Telibagh Hub',
        time: 'Yesterday at 4:30 PM',
        timestamp: '2026-05-15T16:30:00',
        icon: <Users size={18} />,
        color: '#EC4899',
        bgColor: '#FDF2F8',
        isRead: true,
        action: 'View Hub',
        link: '/hubs/all-hubs',
      },
      {
        id: 6,
        type: 'dispute',
        title: 'Order Dispute Raised',
        message: 'Customer raised dispute for Order #ORD767816 - Amount: ₹1,080.00',
        time: 'Yesterday at 2:15 PM',
        timestamp: '2026-05-15T14:15:00',
        icon: <AlertCircle size={18} />,
        color: '#DC2626',
        bgColor: '#FEE2E2',
        isRead: true,
        action: 'Resolve Dispute',
        link: '/orders',
      },
    ],
    earlier: [
      {
        id: 7,
        type: 'system',
        title: 'System Update',
        message: 'City panel updated to version 2.1.0 with new features',
        time: 'May 14, 2026',
        timestamp: '2026-05-14T09:00:00',
        icon: <RefreshCw size={18} />,
        color: '#6B7280',
        bgColor: '#F3F4F6',
        isRead: true,
        action: 'Learn More',
        link: '#',
      },
      {
        id: 8,
        type: 'zone',
        title: 'New Hub Zone Added',
        message: 'Chidiyaghar Hub zone has been added to the city panel',
        time: 'May 11, 2026',
        timestamp: '2026-05-11T11:00:00',
        icon: <MapPin size={18} />,
        color: '#14B8A6',
        bgColor: '#F0FDFA',
        isRead: true,
        action: 'View Zone',
        link: '/hubs/hub-zone',
      },
    ],
  },
};

export const Notifications = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get all notifications flattened
  const getAllNotifications = () => {
    return [
      ...notifications.notifications.today,
      ...notifications.notifications.yesterday,
      ...notifications.notifications.earlier,
    ];
  };

  // Filter notifications based on tab and search
  const getFilteredNotifications = () => {
    let filtered = [];
    
    if (activeTab === 'all') {
      filtered = getAllNotifications();
    } else if (activeTab === 'today') {
      filtered = notifications.notifications.today;
    } else if (activeTab === 'yesterday') {
      filtered = notifications.notifications.yesterday;
    } else if (activeTab === 'earlier') {
      filtered = notifications.notifications.earlier;
    } else if (activeTab === 'unread') {
      filtered = getAllNotifications().filter(n => !n.isRead);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = getAllNotifications().filter(n => !n.isRead).length;

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Here you would fetch new data
    }, 1000);
  };

  // Get icon based on notification type
  const getNotificationIcon = (notification) => {
    return (
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: notification.bgColor }}
      >
        <div style={{ color: notification.color }}>{notification.icon}</div>
      </div>
    );
  };

  // Format the notification time
  const formatTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInHours = Math.floor((now - notifTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return notifTime.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const tabs = [
    { id: 'all', label: 'All', count: notifications.count },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'today', label: 'Today', count: notifications.notifications.today.length },
    { id: 'yesterday', label: 'Yesterday', count: notifications.notifications.yesterday.length },
    { id: 'earlier', label: 'Earlier', count: notifications.notifications.earlier.length },
  ];

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
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center relative"
              style={{ backgroundColor: Colors.primaryExtraLightGreen }}
            >
              <Bell size={24} style={{ color: Colors.primaryGreen }} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
                Notifications
              </h1>
              <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
                {notifications.count} total notifications • {unreadCount} unread
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: Colors.textGrey1 }}
              />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                style={{ minWidth: 200 }}
              />
            </div>

            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <RefreshCw 
                size={18} 
                className={isRefreshing ? 'animate-spin' : ''}
                style={{ color: Colors.textGrey1 }}
              />
            </motion.button>

           
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab.id 
                  ? Colors.primaryExtraLightGreen 
                  : 'transparent',
                color: activeTab === tab.id 
                  ? Colors.primaryGreen 
                  : Colors.textGrey1,
              }}
            >
              {tab.label}
              <span
                className="px-2 py-0.5 rounded-full text-xs"
                style={{
                  backgroundColor: activeTab === tab.id 
                    ? Colors.primaryGreen 
                    : Colors.containerGrey2,
                  color: activeTab === tab.id 
                    ? 'white' 
                    : Colors.textGrey1,
                }}
              >
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Bell size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium" style={{ color: Colors.textBlack }}>
              No notifications found
            </p>
            <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
              {searchQuery 
                ? 'Try adjusting your search query' 
                : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                    !notification.isRead ? 'bg-green-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {getNotificationIcon(notification)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 
                              className={`text-sm font-semibold ${
                                !notification.isRead ? 'text-black' : ''
                              }`}
                              style={{ color: Colors.textBlack }}
                            >
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            )}
                          </div>
                          <p 
                            className="text-sm mt-1"
                            style={{ color: Colors.textGrey1 }}
                          >
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span 
                            className="text-xs"
                            style={{ color: Colors.textGrey1 }}
                          >
                            {notification.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span 
                          className="text-xs px-2 py-1 rounded-full capitalize"
                          style={{
                            backgroundColor: notification.bgColor,
                            color: notification.color,
                          }}
                        >
                          {notification.type}
                        </span>
                        
                        <motion.button
                          whileHover={{ x: 5 }}
                          className="text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: Colors.primaryGreen }}
                        >
                          {notification.action}
                          <ChevronRight size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Mark All as Read Button */}
      {unreadCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button
            className="px-6 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{
              backgroundColor: Colors.primaryExtraLightGreen,
              color: Colors.primaryGreen,
            }}
          >
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle size={16} />
              Mark All as Read
            </div>
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};