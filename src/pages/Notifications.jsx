// src/pages/Notifications.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  RefreshCw,
  Loader,
  Circle,
  Clock,
  Package,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../config/ApiConfig';

const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
  white: '#FFFFFF',
};

// Notification type icons
const getNotificationIcon = (type) => {
  const icons = {
    0: <Bell size={16} />,
    1: <ShoppingCart size={16} />,
    2: <Package size={16} />,
    3: <AlertTriangle size={16} />,
    4: <CheckCircle size={16} />,
  };
  return icons[type] || <Info size={16} />;
};

// Notification type colors
const getNotificationColor = (type) => {
  const colors = {
    0: '#6B7280',
    1: '#3B82F6',
    2: '#10B981',
    3: '#F59E0B',
    4: '#8B5CF6',
  };
  return colors[type] || '#6B7280';
};

export const Notifications = () => {
  const [notificationData, setNotificationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(ENDPOINTS.NOTIFICATIONS);
      if (response.status === 200) {
        setNotificationData(response.data?.data || response.data);
      }
    } catch (error) {
      console.error('Notification fetch error:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const formatDate = (dateTime) => {
    if (!dateTime) return '';
    try {
      const dt = new Date(dateTime);
      if (isNaN(dt)) return dateTime;
      return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}  ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
    } catch {
      return dateTime;
    }
  };

  const notifications = notificationData?.notifications;
  const todayList = notifications?.today || [];
  const yesterdayList = notifications?.yesterday || [];
  const earlierList = notifications?.earlier || [];
  const totalCount = notificationData?.count || 0;

  const hasData = todayList.length > 0 || yesterdayList.length > 0 || earlierList.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      
      {/* Content */}
      <div className="p-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={32} className="animate-spin text-green-800" />
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Bell size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-bold text-lg">No Notifications</p>
            <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total count badge */}
            <div className="flex items-center gap-2 px-1">
              <span className="px-3 py-1.5 bg-green-50 text-green-800 rounded-full text-xs font-bold border border-green-100">
                {totalCount} Total
              </span>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                {todayList.length} Today
              </span>
              {yesterdayList.length > 0 && (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold border border-gray-200">
                  {yesterdayList.length} Yesterday
                </span>
              )}
            </div>

            {/* Today */}
            {todayList.length > 0 && (
              <Section
                title="Today"
                list={todayList}
                formatDate={formatDate}
                getNotificationIcon={getNotificationIcon}
                getNotificationColor={getNotificationColor}
              />
            )}

            {/* Yesterday */}
            {yesterdayList.length > 0 && (
              <Section
                title="Yesterday"
                list={yesterdayList}
                formatDate={formatDate}
                getNotificationIcon={getNotificationIcon}
                getNotificationColor={getNotificationColor}
              />
            )}

            {/* Earlier */}
            {earlierList.length > 0 && (
              <Section
                title="Earlier"
                list={earlierList}
                formatDate={formatDate}
                getNotificationIcon={getNotificationIcon}
                getNotificationColor={getNotificationColor}
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Section Component ─────────────────────────────────────────────────────────
const Section = ({ title, list, formatDate, getNotificationIcon, getNotificationColor }) => (
  <div>
    <h2 className="text-base font-extrabold text-gray-800 mb-3 flex items-center gap-2">
      <div className="w-1 h-5 rounded-full bg-green-700" />
      {title}
      <span className="text-xs font-normal text-gray-400 ml-1">({list.length})</span>
    </h2>
    <div className="space-y-2.5">
      {list.map((item, index) => (
        <NotificationTile
          key={item.id || index}
          item={item}
          formatDate={formatDate}
          getNotificationIcon={getNotificationIcon}
          getNotificationColor={getNotificationColor}
        />
      ))}
    </div>
  </div>
);

// ── Notification Tile ─────────────────────────────────────────────────────────
const NotificationTile = ({ item, formatDate, getNotificationIcon, getNotificationColor }) => {
  const isRead = item.isRead == 1 || item.is_read == 1;
  const typeColor = getNotificationColor(item.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3.5 rounded-2xl border transition-all ${
        isRead
          ? 'bg-gray-50 border-gray-200'
          : 'bg-blue-50/50 border-blue-200 shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Indicator dot */}
        <div className="mt-1.5 flex-shrink-0">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isRead ? 'bg-gray-300' : 'bg-blue-500 shadow-sm shadow-blue-300'
            }`}
          />
        </div>

        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${typeColor}15` }}
        >
          <span style={{ color: typeColor }}>{getNotificationIcon(item.type)}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${
              isRead ? 'font-medium text-gray-700' : 'font-bold text-gray-900'
            }`}
          >
            {item.title || 'Notification'}
          </p>
          {item.message && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {item.message}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Clock size={11} />
            {formatDate(item.datetime)}
          </p>
        </div>

        {/* Unread badge */}
        {!isRead && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex-shrink-0">
            New
          </span>
        )}
      </div>
    </motion.div>
  );
};