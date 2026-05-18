// src/pages/OrderProfileDetails.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  Clock,
  IndianRupee,
  Truck,
  AlertCircle,
  RefreshCw,
  Hash,
  CreditCard,
  Shield,
  Navigation,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Building2,
  Bike,
  Timer,
} from 'lucide-react';
import { useOrderProfileViewModel } from '../hooks/useOrderProfileViewModel';
import { FileText, Download } from 'lucide-react';
import { generateInvoice } from '../components/infoGenerator';

const Colors = {
  primaryGreen: '#14532D',
  primaryLightGreen: '#4ADE80',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
  containerGrey2: '#F3F4F6',
  white: '#FFFFFF',
};

// Status configuration
const STATUS_CONFIG = {
  0: { label: 'Placed', color: 'bg-blue-100 text-blue-700', borderColor: 'border-blue-400', icon: <Clock size={18} /> },
  1: { label: 'Confirmed', color: 'bg-green-100 text-green-700', borderColor: 'border-green-400', icon: <CheckCircle size={18} /> },
  2: { label: 'Picked', color: 'bg-indigo-100 text-indigo-700', borderColor: 'border-indigo-400', icon: <Package size={18} /> },
  3: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', borderColor: 'border-orange-400', icon: <Truck size={18} /> },
  4: { label: 'In Transit', color: 'bg-purple-100 text-purple-700', borderColor: 'border-purple-400', icon: <Truck size={18} /> },
  5: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', borderColor: 'border-emerald-400', icon: <CheckCircle size={18} /> },
  6: { label: 'Cancelled', color: 'bg-red-100 text-red-700', borderColor: 'border-red-400', icon: <XCircle size={18} /> },
};

const PAYMENT_STATUS = {
  0: { label: 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300' },
  1: { label: 'Paid', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-300' },
};

export const OrderProfileDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orderProfile, isLoading, error, fetchOrderProfile } = useOrderProfileViewModel();

  useEffect(() => {
    if (orderId) {
      fetchOrderProfile(orderId);
    }
  }, [orderId, fetchOrderProfile]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
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
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Failed to Load Order</h2>
        <p className="text-sm mb-4 text-gray-500">{error}</p>
        <button
          onClick={() => fetchOrderProfile(orderId)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-green-800 hover:bg-green-900"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!orderProfile) return null;

  const order = orderProfile.order;
  const items = orderProfile.items || [];
  const tracking = orderProfile.tracking || [];
  const payment = orderProfile.payment;
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium hover:bg-gray-50"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </motion.button>

      {/* Order Header Card */}
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden`}>
        <div className={`p-5 border-b-4 ${statusConfig.borderColor}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <ShoppingBag size={24} style={{ color: Colors.primaryGreen }} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: Colors.textBlack }}>
                  {order.order_no}
                </h1>
                <p className="text-xs" style={{ color: Colors.textGrey1 }}>
                  Order ID: #{order.id} • {formatDate(order.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${PAYMENT_STATUS[order.payment_status]?.border} ${PAYMENT_STATUS[order.payment_status]?.bg} ${PAYMENT_STATUS[order.payment_status]?.color}`}>
                {PAYMENT_STATUS[order.payment_status]?.label || 'Unknown'}
              </span>
            </div>
            {/* ✅ Add Invoice Download Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => generateInvoice(orderProfile)}
              className="px-4 py-2 rounded-xl bg-green-800 text-white text-sm font-semibold flex items-center gap-2 hover:bg-green-900 transition-all shadow-sm"
            >
              <Download size={16} />
              Invoice
            </motion.button>
          </div>
        </div>


        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="space-y-4">
            <SectionTitle title="Order Information" />

            <div className="grid grid-cols-2 gap-3">
              <InfoCard icon={<Hash size={16} />} label="Order Number" value={order.order_no} />
              <InfoCard icon={<Clock size={16} />} label="Order Date" value={formatDate(order.created_at)} />
              <InfoCard icon={<CreditCard size={16} />} label="Payment Method" value={order.payment_method?.toUpperCase()} />
              <InfoCard icon={<Shield size={16} />} label="OTP" value={order.otp || 'N/A'} highlight />
              {order.delivered_at && (
                <InfoCard icon={<CheckCircle size={16} />} label="Delivered At" value={formatDate(order.delivered_at)} />
              )}
              {order.delivery_distance && (
                <InfoCard icon={<Navigation size={16} />} label="Distance" value={`${order.delivery_distance} km`} />
              )}
            </div>

            {/* Amount Breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Amount Breakdown</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Charge</span>
                <span className="font-semibold">{formatCurrency(order.delivery_charge)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Boy Charge</span>
                <span className="font-semibold">{formatCurrency(order.deliveryboy_charge)}</span>
              </div>
              {parseFloat(order.extra_charge) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Extra Charge</span>
                  <span className="font-semibold text-red-600">+{formatCurrency(order.extra_charge)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 flex justify-between text-base">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-green-800">{formatCurrency(order.final_amount)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="space-y-4">
            <SectionTitle title="Customer Details" />

            <div className="space-y-3">
              <InfoCard icon={<User size={16} />} label="Customer Name" value={order.customer_name} />
              <InfoCard icon={<Phone size={16} />} label="Phone" value={order.customer_phone} />
              <InfoCard icon={<MapPin size={16} />} label="Delivery Address" value={`${order.address}${order.landmark ? `, ${order.landmark}` : ''}`} />
              <InfoCard icon={<MapPin size={16} />} label="Pincode" value={order.pincode} />
            </div>

            {/* Hub & Delivery Info */}
            <SectionTitle title="Hub & Delivery" />
            <div className="space-y-3">
              {order.hub_name && (
                <InfoCard icon={<Building2 size={16} />} label="Hub" value={order.hub_name} />
              )}
              {order.delivery_name && (
                <InfoCard icon={<Bike size={16} />} label="Delivery Boy" value={order.delivery_name} />
              )}
              {order.delivery_phone && (
                <InfoCard icon={<Phone size={16} />} label="Delivery Phone" value={order.delivery_phone} />
              )}
              {!order.hub_name && !order.delivery_name && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  No hub/delivery info available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Package size={20} style={{ color: Colors.primaryGreen }} />
            <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
              Order Items ({items.length})
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                {item.img ? (
                  <img src={item.img} alt={item.product_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={24} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">{item.product_name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-green-800">{formatCurrency(item.price)}</span>
                  <span className="text-xs text-gray-400">×</span>
                  <span className="text-sm font-semibold text-gray-600">Qty: {item.qty}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{formatCurrency(item.total_price)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-8">
            <Package size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500">No items found</p>
          </div>
        )}
      </div>

      {/* Tracking Timeline */}
      {tracking.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Timer size={20} style={{ color: Colors.primaryGreen }} />
              <h2 className="text-lg font-bold" style={{ color: Colors.textBlack }}>
                Order Timeline
              </h2>
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-0">
              {tracking.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    {index < tracking.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className={`pb-4 ${index === tracking.length - 1 ? '' : ''}`}>
                    <p className="text-sm font-semibold text-gray-900">
                      {event.status || event.status_text || 'Status Update'}
                    </p>
                    {event.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(event.created_at || event.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Section Title Component
const SectionTitle = ({ title }) => (
  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
    <div className="w-1 h-4 rounded-full bg-green-700" />
    {title}
  </h3>
);

// Info Card Component
const InfoCard = ({ icon, label, value, highlight }) => (
  <div className={`p-3 rounded-xl border ${highlight ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-gray-400">{icon}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
    <p className={`text-sm font-semibold ${highlight ? 'text-green-800' : 'text-gray-900'}`}>
      {value || 'N/A'}
    </p>
  </div>
);