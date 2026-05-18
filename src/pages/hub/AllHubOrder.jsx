// // src/pages/hubs/HubOrders.jsx
// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   Package,
//   User,
//   Clock,
//   IndianRupee,
//   CheckCircle,
//   XCircle,
//   Truck,
//   AlertCircle,
//   RefreshCw,
//   Loader,
//   Search,
//   Filter,
//   ChevronDown,
//   Hash,
// } from 'lucide-react';
// import { useHubOrdersViewModel } from '../../hooks/useHubOrdersViewModel';

// const Colors = {
//   primaryGreen: '#14532D',
//   primaryLightGreen: '#4ADE80',
//   primaryExtraLightGreen: '#F0FDF4',
//   textBlack: '#1F2937',
//   textGrey1: '#6B7280',
//   containerGrey2: '#F3F4F6',
//   white: '#FFFFFF',
// };

// // Status configuration
// const STATUS_CONFIG = {
//   0: { label: 'Placed', color: 'bg-blue-100 text-blue-700', icon: <Clock size={14} /> },
//   1: { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} /> },
//   2: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: <Package size={14} /> },
//   3: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', icon: <Truck size={14} /> },
//   4: { label: 'In Transit', color: 'bg-purple-100 text-purple-700', icon: <Truck size={14} /> },
//   5: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={14} /> },
//   6: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <XCircle size={14} /> },
// };

// export const HubOrders = () => {
//   const { hubId } = useParams();
//   const navigate = useNavigate();
//   const { ordersData, isLoading, error, fetchHubOrders } = useHubOrdersViewModel();
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [expandedOrder, setExpandedOrder] = useState(null);

//   useEffect(() => {
//     if (hubId) {
//       fetchHubOrders(hubId);
//     }
//   }, [hubId, fetchHubOrders]);

//   // Filter orders
//   const filteredOrders = ordersData?.filter(order => {
//     const matchesSearch = 
//       order.order_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
//     const matchesStatus = 
//       statusFilter === 'all' || 
//       order.status?.toString() === statusFilter;

//     return matchesSearch && matchesStatus;
//   }) || [];

//   // Get unique statuses for filter
//   const statusCounts = ordersData?.reduce((acc, order) => {
//     const status = order.status?.toString();
//     acc[status] = (acc[status] || 0) + 1;
//     return acc;
//   }, {}) || {};

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//     }).format(amount);
//   };

//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="space-y-6 animate-pulse">
//         <div className="h-10 w-32 bg-gray-200 rounded-lg" />
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
//           <div className="space-y-3">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className="h-16 bg-gray-200 rounded-xl" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error State
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16">
//         <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
//           <AlertCircle size={32} style={{ color: '#DC2626' }} />
//         </div>
//         <h2 className="text-lg font-semibold mb-2" style={{ color: Colors.textBlack }}>
//           Failed to Load Orders
//         </h2>
//         <p className="text-sm mb-4" style={{ color: Colors.textGrey1 }}>{error}</p>
//         <button
//           onClick={() => fetchHubOrders(hubId)}
//           className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
//           style={{ backgroundColor: Colors.primaryGreen }}
//         >
//           <RefreshCw size={16} />
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-6"
//     >
//       {/* Back Button & Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => navigate('/hubs/hub-performance')}
//             className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium hover:bg-gray-50"
//           >
//             <ArrowLeft size={18} />
//             Back
//           </motion.button>
//           <div>
//             <h1 className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
//               Hub Orders
//             </h1>
//             <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
//               {ordersData?.length || 0} total orders
//             </p>
//           </div>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => fetchHubOrders(hubId)}
//           className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//         >
//           <RefreshCw size={20} style={{ color: Colors.textGrey1 }} />
//         </motion.button>
//       </div>

//       {/* Search & Filters */}
//       <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="relative flex-1">
//             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by order number or customer..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-green-200"
//             />
//           </div>
//         </div>

//         {/* Status Filter Chips */}
//         <div className="flex gap-2 mt-3 flex-wrap">
//           <button
//             onClick={() => setStatusFilter('all')}
//             className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
//               statusFilter === 'all'
//                 ? 'bg-green-100 text-green-800'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//             }`}
//           >
//             All ({ordersData?.length || 0})
//           </button>
//           {Object.entries(STATUS_CONFIG).map(([status, config]) => {
//             const count = statusCounts[status] || 0;
//             if (count === 0) return null;
//             return (
//               <button
//                 key={status}
//                 onClick={() => setStatusFilter(status)}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
//                   statusFilter === status
//                     ? config.color
//                     : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                 }`}
//               >
//                 {config.label} ({count})
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Orders List */}
//       <div className="space-y-3">
//         <AnimatePresence>
//           {filteredOrders.map((order, index) => (
//             <motion.div
//               key={order.order_id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               transition={{ delay: index * 0.03 }}
//               className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
//             >
//               <div
//                 className="p-4 cursor-pointer"
//                 onClick={() => setExpandedOrder(expandedOrder === order.order_id ? null : order.order_id)}
                
                
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     {/* Order Number */}
//                     <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
//                       <Hash size={18} style={{ color: Colors.primaryGreen }} />
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm font-bold" style={{ color: Colors.textBlack }}>
//                           {order.order_no}
//                         </p>
//                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${STATUS_CONFIG[order.status]?.color || 'bg-gray-100 text-gray-700'}`}>
//                           {STATUS_CONFIG[order.status]?.icon}
//                           {order.status_text}
//                         </span>
//                       </div>
//                       <p className="text-xs mt-0.5" style={{ color: Colors.textGrey1 }}>
//                         {order.customer_name}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-4">
//                     <div className="text-right">
//                       <p className="text-sm font-bold" style={{ color: Colors.textBlack }}>
//                         {formatCurrency(order.final_amount)}
//                       </p>
//                       <p className="text-xs" style={{ color: Colors.textGrey1 }}>
//                         {formatDate(order.created_at)}
//                       </p>
//                     </div>
//                     <motion.div
//                       animate={{ rotate: expandedOrder === order.order_id ? 180 : 0 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <ChevronDown size={18} style={{ color: Colors.textGrey1 }} />
//                     </motion.div>
//                   </div>
//                 </div>
//               </div>

//               {/* Expanded Details */}
//               <AnimatePresence>
//                 {expandedOrder === order.order_id && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: 'auto', opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="overflow-hidden"
//                   >
//                     <div className="px-4 pb-4 border-t border-gray-100">
//                       <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//                         <DetailItem
//                           icon={<User size={16} />}
//                           label="Customer"
//                           value={order.customer_name}
//                         />
//                         <DetailItem
//                           icon={<Hash size={16} />}
//                           label="Order No"
//                           value={order.order_no}
//                         />
//                         <DetailItem
//                           icon={<IndianRupee size={16} />}
//                           label="Amount"
//                           value={formatCurrency(order.final_amount)}
//                         />
//                         <DetailItem
//                           icon={<Clock size={16} />}
//                           label="Date"
//                           value={formatDate(order.created_at)}
//                         />
//                         <DetailItem
//                           icon={STATUS_CONFIG[order.status]?.icon || <Package size={16} />}
//                           label="Status"
//                           value={
//                             <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[order.status]?.color}`}>
//                               {order.status_text}
//                             </span>
//                           }
//                         />
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           ))}
//         </AnimatePresence>

//         {filteredOrders.length === 0 && (
//           <div className="text-center py-16">
//             <Package size={48} className="mx-auto mb-3 text-gray-300" />
//             <p className="text-lg font-medium" style={{ color: Colors.textBlack }}>
//               No orders found
//             </p>
//             <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
//               Try adjusting your search or filter
//             </p>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// // Detail Item Component
// const DetailItem = ({ icon, label, value }) => (
//   <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
//     <div className="text-gray-400 mt-0.5">{icon}</div>
//     <div>
//       <p className="text-xs text-gray-400">{label}</p>
//       <div className="text-sm font-semibold text-gray-900 mt-0.5">{value}</div>
//     </div>
//   </div>
// );
// src/pages/hubs/HubOrders.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  User,
  Clock,
  IndianRupee,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronDown,
  Hash,
  Eye,
} from 'lucide-react';
import { useHubOrdersViewModel } from '../../hooks/useHubOrdersViewModel';

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
  0: { label: 'Placed', color: 'bg-blue-100 text-blue-700', icon: <Clock size={14} /> },
  1: { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: <CheckCircle size={14} /> },
  2: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: <Package size={14} /> },
  3: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', icon: <Truck size={14} /> },
  4: { label: 'In Transit', color: 'bg-purple-100 text-purple-700', icon: <Truck size={14} /> },
  5: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={14} /> },
  6: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <XCircle size={14} /> },
};

export const HubOrders = () => {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const { ordersData, isLoading, error, fetchHubOrders } = useHubOrdersViewModel();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (hubId) {
      fetchHubOrders(hubId);
    }
  }, [hubId, fetchHubOrders]);

  // Filter orders
  const filteredOrders = ordersData?.filter(order => {
    const matchesSearch = 
      order.order_no?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      order.status?.toString() === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  // Get unique statuses for filter
  const statusCounts = ordersData?.reduce((acc, order) => {
    const status = order.status?.toString();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {}) || {};

  // Format date
  const formatDate = (dateString) => {
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
    }).format(amount);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl" />
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
          Failed to Load Orders
        </h2>
        <p className="text-sm mb-4" style={{ color: Colors.textGrey1 }}>{error}</p>
        <button
          onClick={() => fetchHubOrders(hubId)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: Colors.primaryGreen }}
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/hubs/hub-performance')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: Colors.textBlack }}>
              Hub Orders
            </h1>
            <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
              {ordersData?.length || 0} total orders
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchHubOrders(hubId)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RefreshCw size={20} style={{ color: Colors.textGrey1 }} />
        </motion.button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({ordersData?.length || 0})
          </button>
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const count = statusCounts[status] || 0;
            if (count === 0) return null;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? config.color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.order_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Main row - click to expand/collapse */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order.order_id ? null : order.order_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <Hash size={18} style={{ color: Colors.primaryGreen }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold" style={{ color: Colors.textBlack }}>
                          {order.order_no}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${STATUS_CONFIG[order.status]?.color || 'bg-gray-100 text-gray-700'}`}>
                          {STATUS_CONFIG[order.status]?.icon}
                          {order.status_text}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: Colors.textGrey1 }}>
                        {order.customer_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: Colors.textBlack }}>
                        {formatCurrency(order.final_amount)}
                      </p>
                      <p className="text-xs" style={{ color: Colors.textGrey1 }}>
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedOrder === order.order_id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={18} style={{ color: Colors.textGrey1 }} />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedOrder === order.order_id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <DetailItem
                          icon={<User size={16} />}
                          label="Customer"
                          value={order.customer_name}
                        />
                        <DetailItem
                          icon={<Hash size={16} />}
                          label="Order No"
                          value={order.order_no}
                        />
                        <DetailItem
                          icon={<IndianRupee size={16} />}
                          label="Amount"
                          value={formatCurrency(order.final_amount)}
                        />
                        <DetailItem
                          icon={<Clock size={16} />}
                          label="Date"
                          value={formatDate(order.created_at)}
                        />
                        <DetailItem
                          icon={STATUS_CONFIG[order.status]?.icon || <Package size={16} />}
                          label="Status"
                          value={
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[order.status]?.color}`}>
                              {order.status_text}
                            </span>
                          }
                        />
                      </div>
                      
                      {/* ✅ View Full Details Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${order.order_id}`);
                        }}
                        className="w-full mt-4 py-3 rounded-xl bg-green-50 text-green-800 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-green-100 transition-colors border border-green-200"
                      >
                        <Eye size={16} />
                        View Full Order Details
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium" style={{ color: Colors.textBlack }}>
              No orders found
            </p>
            <p className="text-sm mt-1" style={{ color: Colors.textGrey1 }}>
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Detail Item Component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
    <div className="text-gray-400 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <div className="text-sm font-semibold text-gray-900 mt-0.5">{value}</div>
    </div>
  </div>
);