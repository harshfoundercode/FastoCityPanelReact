// // src/pages/stocks/StockHistory.jsx
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Search,
//   X,
//   RefreshCw,
//   Package,
//   Inbox,
//   ChevronDown,
//   ChevronUp,
//   Clock,
//   Building2,
//   AlertTriangle,
//   Loader,
//   Filter,
//   ArrowUpDown,
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import apiClient, { ENDPOINTS } from '../../config/ApiConfig';
// import { AppHeader } from './AppHeader';

// const Colors = {
//   primaryGreen: '#14532D',
//   greenSoft: '#F0FDF4',
//   textBlack: '#1F2937',
//   textGrey: '#6B7280',
//   border: '#E5E7EB',
//   white: '#FFFFFF',
//   bg: '#F4F6F9',
//   warn: '#F59E0B',
//   success: '#16A34A',
//   error: '#DC2626',
//   info: '#2563EB',
// };

// const ADMIN_STATUSES = ['All', 'Pending', 'Accepted', 'Completed'];
// const HUB_STATUSES = ['All', 'Pending', 'Received', 'Completed'];
// const SORT_OPTIONS = ['Newest', 'Oldest', 'Quantity: High', 'Quantity: Low'];

// export const StockHistory = () => {
//   const [activeTab, setActiveTab] = useState(0); // 0=Admin, 1=Hub
//   const [searchQuery, setSearchQuery] = useState('');
//   const [adminStatus, setAdminStatus] = useState('All');
//   const [hubStatus, setHubStatus] = useState('All');
//   const [sortBy, setSortBy] = useState('Newest');

//   // Data states
//   const [adminHistory, setAdminHistory] = useState(null);
//   const [hubHistory, setHubHistory] = useState(null);
//   const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
//   const [isLoadingHub, setIsLoadingHub] = useState(false);

//   // Fetch data
//   const fetchAllData = useCallback(async () => {
//     fetchAdminHistory();
//     fetchHubHistory();
//   }, []);

//   const fetchAdminHistory = async () => {
//     setIsLoadingAdmin(true);
//     try {
//       const response = await apiClient.get(ENDPOINTS.ADMIN_REQUEST_HISTORY);
//       if (response.status === 200) {
//         setAdminHistory(response.data?.data || []);
//       }
//     } catch (error) {
//       toast.error('Failed to load admin history');
//     } finally {
//       setIsLoadingAdmin(false);
//     }
//   };

//   const fetchHubHistory = async () => {
//     setIsLoadingHub(true);
//     try {
//       const response = await apiClient.get(ENDPOINTS.HUB_HISTORY);
//       if (response.status === 200) {
//         setHubHistory(response.data?.data || []);
//       }
//     } catch (error) {
//       toast.error('Failed to load hub history');
//     } finally {
//       setIsLoadingHub(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, [fetchAllData]);

//   // Status helpers
//   const getAdminStatusText = (status) => {
//     const s = parseInt(status);
//     if (s === 0) return 'Pending';
//     if (s === 1) return 'Accepted';
//     if (s === 2) return 'Completed';
//     return 'Unknown';
//   };

//   const getHubStatusText = (status) => {
//     const s = parseInt(status);
//     if (s === 0) return 'Pending';
//     if (s === 1) return 'Received';
//     if (s === 2) return 'Completed';
//     return 'Unknown';
//   };

//   const getStatusColor = (status) => {
//     const s = parseInt(status);
//     if (s === 0) return Colors.warn;
//     if (s === 1) return Colors.success;
//     if (s === 2) return Colors.info;
//     return Colors.textGrey;
//   };

//   // Filter and sort admin data
//   const filteredAdminData = useMemo(() => {
//     if (!adminHistory) return [];
//     let result = [...adminHistory];

//     // Filter by search
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       result = result.filter(item => {
//         const productNames = (item.products || []).map(p => (p.product_name || p.productName || '').toLowerCase()).join(' ');
//         return String(item.request_id || item.requestId).toLowerCase().includes(q) || productNames.includes(q);
//       });
//     }

//     // Filter by status
//     if (adminStatus !== 'All') {
//       result = result.filter(item => getAdminStatusText(item.status) === adminStatus);
//     }

//     // Sort
//     result.sort((a, b) => {
//       const getTotalQty = (item) => (item.products || []).reduce((sum, p) => sum + (parseInt(p.requested_quantity || p.requestedQuantity) || 0), 0);
//       const aDate = new Date(a.created_at || a.createdAt || 0);
//       const bDate = new Date(b.created_at || b.createdAt || 0);

//       switch (sortBy) {
//         case 'Oldest': return aDate - bDate;
//         case 'Quantity: High': return getTotalQty(b) - getTotalQty(a);
//         case 'Quantity: Low': return getTotalQty(a) - getTotalQty(b);
//         default: return bDate - aDate;
//       }
//     });

//     return result;
//   }, [adminHistory, searchQuery, adminStatus, sortBy]);

//   const getLatestDate = (product) => {
//     if (!product.transfers?.length) return new Date(2000);
//     const dates = product.transfers.map(t => new Date(t.created_at || t.createdAt || 0)).filter(d => !isNaN(d));
//     return dates.length ? new Date(Math.max(...dates)) : new Date(2000);
//   };

//   // Filter and sort hub data
//   const filteredHubData = useMemo(() => {
//     if (!hubHistory) return [];
//     let result = [...hubHistory];

//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       result = result.filter(p => {
//         return (p.product_name || p.productName || '').toLowerCase().includes(q) ||
//           (p.sku || '').toLowerCase().includes(q) ||
//           (p.brand_name || p.brandName || '').toLowerCase().includes(q);
//       });
//     }

//     if (hubStatus !== 'All') {
//       result = result.filter(p =>
//         (p.transfers || []).some(t => getHubStatusText(t.status) === hubStatus)
//       );
//     }

//     result.sort((a, b) => {
//       const aDate = getLatestDate(a);
//       const bDate = getLatestDate(b);
//       return sortBy === 'Oldest' ? aDate - bDate : bDate - aDate;
//     });

//     return result;
//   }, [hubHistory, searchQuery, hubStatus, sortBy]);



//   const formatDate = (raw) => {
//     try {
//       const dt = new Date(raw);
//       if (isNaN(dt)) return raw;
//       const diff = Date.now() - dt;
//       if (diff < 60000) return 'Just now';
//       if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
//       if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
//       return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`;
//     } catch { return raw; }
//   };

//   const currentStatuses = activeTab === 0 ? ADMIN_STATUSES : HUB_STATUSES;
//   const currentStatus = activeTab === 0 ? adminStatus : hubStatus;

//   return (
//     <div className="flex flex-col h-143">
//       <AppHeader
//         title="History"
//         subtitle="Track all your requests and transfers"
//         actions={
//           <button onClick={fetchAllData} className="p-2 rounded-lg hover:bg-gray-100">
//             <RefreshCw size={20} className="text-gray-500" />
//           </button>
//         }
//       />

//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Tab Bar */}
//         <div className="mx-4 mt-3 p-1 bg-gray-100 rounded-xl flex">
//           {['Admin Requests', 'Hub Transfers'].map((label, i) => (
//             <button
//               key={i}
//               onClick={() => setActiveTab(i)}
//               className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === i ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500'
//                 }`}
//             >
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* Search & Sort */}
//         <div className="flex gap-2 mx-4 mt-3">
//           <div className="relative flex-1">
//             <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by name, ID..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-200"
//             />
//             {searchQuery && (
//               <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2">
//                 <X size={15} className="text-gray-400" />
//               </button>
//             )}
//           </div>
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none cursor-pointer"
//           >
//             {SORT_OPTIONS.map(opt => (
//               <option key={opt} value={opt}>{opt}</option>
//             ))}
//           </select>
//         </div>

//         {/* Status Pills */}
//         <div className="flex gap-2 mx-4 mt-3 overflow-x-auto pb-1">
//           {currentStatuses.map((status) => (
//             <button
//               key={status}
//               onClick={() => activeTab === 0 ? setAdminStatus(status) : setHubStatus(status)}
//               className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${currentStatus === status
//                 ? 'border-green-500 bg-green-50 text-green-800'
//                 : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
//                 }`}
//             >
//               {status}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto mx-4 mt-3 mb-4">
//           {activeTab === 0 ? (
//             isLoadingAdmin ? (
//               <div className="flex justify-center py-12"><Loader size={32} className="animate-spin text-green-800" /></div>
//             ) : filteredAdminData.length === 0 ? (
//               <EmptyState message="No requests found" />
//             ) : (
//               <div className="space-y-2.5">
//                 {filteredAdminData.map((item) => (
//                   <AdminRequestCard key={item.request_id || item.requestId} item={item} getStatusText={getAdminStatusText} getStatusColor={getStatusColor} formatDate={formatDate} />
//                 ))}
//               </div>
//             )
//           ) : (
//             isLoadingHub ? (
//               <div className="flex justify-center py-12"><Loader size={32} className="animate-spin text-green-800" /></div>
//             ) : filteredHubData.length === 0 ? (
//               <EmptyState message="No transfers found" />
//             ) : (
//               <div className="space-y-2.5">
//                 {filteredHubData.map((product, i) => (
//                   <HubTransferCard key={i} product={product} statusFilter={hubStatus} getStatusText={getHubStatusText} getStatusColor={getStatusColor} formatDate={formatDate} />
//                 ))}
//               </div>
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Admin Request Card ────────────────────────────────────────────────────────
// const AdminRequestCard = ({ item, getStatusText, getStatusColor, formatDate }) => {
//   const [expanded, setExpanded] = useState(false);
//   const totalQty = (item.products || []).reduce((sum, p) => sum + (parseInt(p.requested_quantity || p.requestedQuantity) || 0), 0);
//   const statusText = getStatusText(item.status);
//   const statusColor = getStatusColor(item.status);

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//       <div className="p-3 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
//         <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${statusColor}15` }}>
//           <Package size={18} style={{ color: statusColor }} />
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-bold text-gray-800">Request #{item.request_id || item.requestId}</p>
//           <p className="text-xs text-gray-400">{(item.products || []).length} products</p>
//         </div>
//         <span className="text-xs font-semibold text-gray-600">Qty: {totalQty}</span>
//         <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
//           <ChevronDown size={18} className="text-gray-400" />
//         </motion.div>
//       </div>

//       <AnimatePresence>
//         {expanded && (
//           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
//             <div className="border-t border-gray-100">
//               {(item.products || []).map((product, idx) => (
//                 <div key={idx} className="p-3 border-b border-gray-50 last:border-0">
//                   <div className="flex items-center gap-3">
//                     {(product.product_img || product.productImg) && (
//                       <img src={product.product_img || product.productImg} alt="" className="w-10 h-10 rounded-lg object-cover" />
//                     )}
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold text-gray-800">{product.product_name || product.productName}</p>
//                       <span className="text-xs font-bold text-green-800">x{product.requested_quantity || product.requestedQuantity}</span>
//                     </div>
//                   </div>
//                   {(product.variants || []).map((v, vIdx) => (
//                     <div key={vIdx} className="mt-2 ml-8 p-2 bg-gray-50 rounded-lg flex items-center gap-3">
//                       {(v.variant_img || v.variantImg) && <img src={v.variant_img || v.variantImg} alt="" className="w-7 h-7 rounded object-cover" />}
//                       <div className="flex-1">
//                         <p className="text-xs font-semibold">{v.variant_value || v.variantValue}</p>
//                         <p className="text-xs text-gray-400">SKU: {v.sku || 'N/A'}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-xs font-bold text-green-800">₹{v.discount_price || v.discountPrice}</p>
//                         {(v.price && v.price !== v.discount_price) && (
//                           <p className="text-xs text-gray-400 line-through">₹{v.price}</p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
//         <Clock size={12} className="text-gray-400" />
//         <span className="text-xs text-gray-500">{formatDate(item.created_at || item.createdAt)}</span>
//         <div className="flex-1" />
//         <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${statusColor}15`, color: statusColor }}>
//           {statusText}
//         </span>
//       </div>
//     </div>
//   );
// };

// // ── Hub Transfer Card ─────────────────────────────────────────────────────────

// // const HubTransferCard = ({ product, statusFilter, getStatusText, getStatusColor, formatDate }) => {
// //   const [expanded, setExpanded] = useState(false);

// //   const filteredTransfers = statusFilter === 'All'
// //     ? (product.transfers || [])
// //     : (product.transfers || []).filter(t => getStatusText(t.status) === statusFilter);

// //   // Calculate totals
// //   const totalSent = filteredTransfers.reduce((sum, t) => {
// //     return sum + (t.variants || []).reduce((vSum, v) => vSum + (parseInt(v.sent_qty) || 0), 0);
// //   }, 0);
  
// //   const totalReceived = filteredTransfers.reduce((sum, t) => {
// //     return sum + (t.variants || []).reduce((vSum, v) => vSum + (parseInt(v.received_qty) || 0), 0);
// //   }, 0);

// //   // Helper to parse dispute images
// //   const parseDisputeImages = (disputeImage, disputeImages) => {
// //     // If dispute_images array exists and has items, use it
// //     if (disputeImages && Array.isArray(disputeImages) && disputeImages.length > 0) {
// //       return disputeImages;
// //     }
    
// //     // Try to parse dispute_image if it's a string
// //     if (disputeImage) {
// //       if (typeof disputeImage === 'string') {
// //         // Check if it's a JSON string
// //         if (disputeImage.startsWith('[')) {
// //           try {
// //             const parsed = JSON.parse(disputeImage);
// //             if (Array.isArray(parsed) && parsed.length > 0) {
// //               return parsed;
// //             }
// //           } catch (e) {
// //             // If parsing fails, treat as single URL
// //           }
// //         }
// //         // If it's a non-empty string that's not JSON array, treat as single URL
// //         if (disputeImage.trim() && !disputeImage.startsWith('[')) {
// //           return [disputeImage];
// //         }
// //       } else if (Array.isArray(disputeImage) && disputeImage.length > 0) {
// //         return disputeImage;
// //       }
// //     }
    
// //     return [];
// //   };

// //   return (
// //     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
// //       {/* Product Header */}
// //       <div 
// //         className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors" 
// //         onClick={() => setExpanded(!expanded)}
// //       >
// //         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden border border-green-200">
// //           {(product.product_img) ? (
// //             <img src={product.product_img} alt={product.product_name} className="w-full h-full object-cover" />
// //           ) : (
// //             <Package size={20} className="text-green-700" />
// //           )}
// //         </div>
        
// //         <div className="flex-1 min-w-0">
// //           <div className="flex items-center gap-2 mb-0.5">
// //             <p className="text-sm font-bold text-gray-800 truncate">{product.product_name}</p>
// //             {product.brand_name && (
// //               <span className="text-xs text-gray-400 font-medium px-2 py-0.5 bg-gray-100 rounded-full truncate max-w-[120px]">
// //                 {product.brand_name}
// //               </span>
// //             )}
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <span className="text-xs text-gray-500">
// //               {product.category_name} {product.subcategory_name ? `› ${product.subcategory_name}` : ''}
// //             </span>
// //           </div>
// //         </div>
        
// //         <div className="flex items-center gap-3">
// //           <div className="text-right">
// //             <div className="flex items-center gap-2 text-xs">
// //               <span className="text-gray-500">Transfers:</span>
// //               <span className="font-bold text-gray-700">{filteredTransfers.length}</span>
// //             </div>
// //             <div className="flex items-center gap-2 text-xs">
// //               <span className="text-gray-500">Total Qty:</span>
// //               <span className="font-bold text-green-700">{totalSent}</span>
// //             </div>
// //           </div>
// //           <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
// //             <ChevronDown size={20} className="text-gray-400" />
// //           </motion.div>
// //         </div>
// //       </div>

// //       {/* Expanded Content */}
// //       <AnimatePresence>
// //         {expanded && (
// //           <motion.div 
// //             initial={{ height: 0, opacity: 0 }} 
// //             animate={{ height: 'auto', opacity: 1 }} 
// //             exit={{ height: 0, opacity: 0 }}
// //             transition={{ duration: 0.2 }}
// //             className="overflow-hidden"
// //           >
// //             <div className="border-t border-gray-200 bg-gray-50">
// //               {filteredTransfers.length > 0 ? (
// //                 filteredTransfers.map((transfer, tIdx) => (
// //                   <div key={transfer.transfer_id || tIdx} className="border-b border-gray-200 last:border-0">
// //                     {/* Transfer Header */}
// //                     <div className="p-3 bg-white">
// //                       <div className="flex items-center justify-between mb-2">
// //                         <div className="flex items-center gap-2">
// //                           <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
// //                             <Building2 size={15} className="text-blue-600" />
// //                           </div>
// //                           <div>
// //                             <p className="text-sm font-semibold text-gray-800">{transfer.hub_name}</p>
// //                             <p className="text-xs text-gray-500">
// //                               {transfer.hub_maneger_name} • {transfer.hub_address}
// //                             </p>
// //                           </div>
// //                         </div>
// //                         <div className="flex items-center gap-2">
// //                           <span className="text-xs text-gray-400 flex items-center gap-1">
// //                             <Clock size={12} />
// //                             {formatDate(transfer.created_at)}
// //                           </span>
// //                           <StatusBadge status={transfer.status} getStatusText={getStatusText} getStatusColor={getStatusColor} />
// //                         </div>
// //                       </div>
                      
// //                       {/* Variants Table */}
// //                       <div className="overflow-x-auto">
// //                         <table className="w-full text-sm">
// //                           <thead>
// //                             <tr className="border-b border-gray-100">
// //                               <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500">Variant</th>
// //                               <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500">Price</th>
// //                               <th className="text-center py-2 px-2 text-xs font-semibold text-blue-600">Sent</th>
// //                               <th className="text-center py-2 px-2 text-xs font-semibold text-green-600">Received</th>
// //                               <th className="text-center py-2 px-2 text-xs font-semibold text-red-600">Missing</th>
// //                               <th className="text-center py-2 px-2 text-xs font-semibold text-orange-600">Dispute</th>
// //                               <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500">Current Stock</th>
// //                             </tr>
// //                           </thead>
// //                           <tbody>
// //                             {(transfer.variants || []).map((v, vIdx) => (
// //                               <React.Fragment key={v.variant_id || vIdx}>
// //                                 <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
// //                                   <td className="py-2 px-2">
// //                                     <p className="font-semibold text-gray-800">{v.value}</p>
// //                                   </td>
// //                                   <td className="py-2 px-2 text-center">
// //                                     <div>
// //                                       <p className="font-bold text-green-700">₹{v.discount_price}</p>
// //                                       {v.price !== v.discount_price && (
// //                                         <p className="text-xs text-gray-400 line-through">₹{v.price}</p>
// //                                       )}
// //                                     </div>
// //                                   </td>
// //                                   <td className="py-2 px-2 text-center">
// //                                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
// //                                       {v.sent_qty || 0}
// //                                     </span>
// //                                   </td>
// //                                   <td className="py-2 px-2 text-center">
// //                                     <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-700 font-bold text-xs">
// //                                       {v.received_qty || 0}
// //                                     </span>
// //                                   </td>
// //                                   <td className="py-2 px-2 text-center">
// //                                     {((v.missing_qty || 0) > 0) ? (
// //                                       <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-700 font-bold text-xs">
// //                                         {v.missing_qty}
// //                                       </span>
// //                                     ) : (
// //                                       <span className="text-gray-300">-</span>
// //                                     )}
// //                                   </td>
// //                                   <td className="py-2 px-2 text-center">
// //                                     {((v.dispute_qty || 0) > 0) ? (
// //                                       <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 text-orange-700 font-bold text-xs">
// //                                         {v.dispute_qty}
// //                                       </span>
// //                                     ) : (
// //                                       <span className="text-gray-300">-</span>
// //                                     )}
// //                                   </td>
// //                                   <td className="py-2 px-2 text-center">
// //                                     <span className="text-xs font-semibold text-gray-600">
// //                                       {v.current_stock || 0}
// //                                     </span>
// //                                   </td>
// //                                 </tr>
                                
// //                                 {/* Dispute Images Row */}
// //                                 {((v.dispute_qty || 0) > 0) && (() => {
// //                                   const images = parseDisputeImages(v.dispute_image, v.dispute_images);
// //                                   if (images.length > 0) {
// //                                     return (
// //                                       <tr key={`dispute-${v.variant_id}`}>
// //                                         <td colSpan="7" className="py-2 px-2">
// //                                           <div className="flex items-center gap-2 ml-4">
// //                                             <span className="text-xs font-semibold text-orange-600 flex items-center gap-1">
// //                                               <AlertTriangle size={12} />
// //                                               Defective Images:
// //                                             </span>
// //                                             <div className="flex gap-2 flex-wrap">
// //                                               {images.map((img, index) => (
// //                                                 <img
// //                                                   key={index}
// //                                                   src={img}
// //                                                   alt={`Defect ${index + 1}`}
// //                                                   className="w-16 h-16 rounded-lg object-cover border-2 border-orange-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform"
// //                                                   onClick={() => window.open(img, '_blank')}
// //                                                 />
// //                                               ))}
// //                                             </div>
// //                                           </div>
// //                                         </td>
// //                                       </tr>
// //                                     );
// //                                   }
// //                                   return null;
// //                                 })()}
// //                               </React.Fragment>
// //                             ))}
// //                           </tbody>
// //                         </table>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="p-8 text-center text-gray-400">
// //                   <Inbox size={32} className="mx-auto mb-2 opacity-50" />
// //                   <p className="text-sm">No transfers found for this status</p>
// //                 </div>
// //               )}
// //             </div>
            
// //             {/* Summary Footer */}
// //             <div className="px-4 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
// //               <div className="flex items-center gap-4">
// //                 <div className="flex items-center gap-1 text-xs text-gray-500">
// //                   <span>Total Transfers:</span>
// //                   <span className="font-bold text-gray-700">{filteredTransfers.length}</span>
// //                 </div>
// //                 <div className="flex items-center gap-1 text-xs">
// //                   <span className="text-gray-500">Sent:</span>
// //                   <span className="font-bold text-blue-600">{totalSent}</span>
// //                 </div>
// //                 <div className="flex items-center gap-1 text-xs">
// //                   <span className="text-gray-500">Received:</span>
// //                   <span className="font-bold text-green-600">{totalReceived}</span>
// //                 </div>
// //               </div>
// //               <div className="text-xs text-gray-400">
// //                 {product.main_category_name} › {product.category_name}
// //               </div>
// //             </div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>
// //     </div>
// //   );
// // };
// // ── Hub Transfer Card ─────────────────────────────────────────────────────────
// const HubTransferCard = ({ product, statusFilter, getStatusText, getStatusColor, formatDate }) => {
//   const filteredTransfers = statusFilter === 'All'
//     ? (product.transfers || [])
//     : (product.transfers || []).filter(t => getStatusText(t.status) === statusFilter);

//   return (
//     <>
//       {filteredTransfers.map((transfer, tIdx) => (
//         <TransferCard 
//           key={transfer.transfer_id || tIdx}
//           transfer={transfer}
//           product={product}
//           getStatusText={getStatusText}
//           getStatusColor={getStatusColor}
//           formatDate={formatDate}
//         />
//       ))}
//     </>
//   );
// };

// // Individual Transfer Card Component
// const TransferCard = ({ transfer, product, getStatusText, getStatusColor, formatDate }) => {
//   const [expanded, setExpanded] = useState(false);

//   // Calculate totals for this transfer
//   const totalSent = (transfer.variants || []).reduce((sum, v) => sum + (parseInt(v.sent_qty) || 0), 0);
//   const totalReceived = (transfer.variants || []).reduce((sum, v) => sum + (parseInt(v.received_qty) || 0), 0);
//   const totalVariants = (transfer.variants || []).length;

//   // Helper to parse dispute images
//   const parseDisputeImages = (disputeImage, disputeImages) => {
//     if (disputeImages && Array.isArray(disputeImages) && disputeImages.length > 0) {
//       return disputeImages;
//     }
    
//     if (disputeImage) {
//       if (typeof disputeImage === 'string') {
//         if (disputeImage.startsWith('[')) {
//           try {
//             const parsed = JSON.parse(disputeImage);
//             if (Array.isArray(parsed) && parsed.length > 0) {
//               return parsed;
//             }
//           } catch (e) {}
//         }
//         if (disputeImage.trim() && !disputeImage.startsWith('[')) {
//           return [disputeImage];
//         }
//       } else if (Array.isArray(disputeImage) && disputeImage.length > 0) {
//         return disputeImage;
//       }
//     }
    
//     return [];
//   };

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//       {/* Card Header - HUB Focused */}
//       <div 
//         className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors" 
//         onClick={() => setExpanded(!expanded)}
//       >
//         {/* Hub Icon */}
//         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-blue-200">
//           <Building2 size={22} className="text-blue-600" />
//         </div>
        
//         <div className="flex-1 min-w-0">
//           {/* Hub Name as Main Title */}
//           <div className="flex items-center gap-2 mb-0.5">
//             <p className="text-sm font-bold text-gray-800 truncate">{transfer.hub_name}</p>
//             <StatusBadge status={transfer.status} getStatusText={getStatusText} getStatusColor={getStatusColor} />
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-gray-500 truncate">{transfer.hub_maneger_name}</span>
//             <span className="text-gray-300">•</span>
//             <span className="text-xs text-gray-400">Transfer #{transfer.transfer_id}</span>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-3">
//           <div className="text-right">
//             <div className="flex items-center gap-1 text-xs text-gray-500">
//               <Package size={12} className="text-gray-400" />
//               <span className="font-bold text-gray-700">{totalSent}</span>
//               <span>items</span>
//             </div>
//             <div className="text-xs text-gray-400 mt-0.5">
//               {formatDate(transfer.created_at)}
//             </div>
//           </div>
//           <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
//             <ChevronDown size={20} className="text-gray-400" />
//           </motion.div>
//         </div>
//       </div>

//       {/* Expanded Content */}
//       <AnimatePresence>
//         {expanded && (
//           <motion.div 
//             initial={{ height: 0, opacity: 0 }} 
//             animate={{ height: 'auto', opacity: 1 }} 
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="overflow-hidden"
//           >
//             <div className="border-t border-gray-200">
//               {/* Hub Details Section */}
//               <div className="p-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Hub Manager</p>
//                     <p className="text-sm font-semibold text-gray-800">{transfer.hub_maneger_name}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Pincode</p>
//                     <p className="text-sm font-semibold text-gray-800">{transfer.pincode}</p>
//                   </div>
//                   <div className="col-span-2">
//                     <p className="text-xs text-gray-500 mb-1">Address</p>
//                     <p className="text-sm font-medium text-gray-700">{transfer.hub_address}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Transfer Date</p>
//                     <p className="text-sm font-semibold text-gray-800">{formatDate(transfer.created_at)}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500 mb-1">Transfer ID</p>
//                     <p className="text-sm font-semibold text-blue-600">#{transfer.transfer_id}</p>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Products in this Transfer */}
//               <div className="p-3 bg-white">
//                 <div className="flex items-center gap-2 mb-3">
//                   <Package size={16} className="text-green-600" />
//                   <h4 className="text-sm font-bold text-gray-700">
//                     Product Details ({totalVariants} variants)
//                   </h4>
//                 </div>
                
//                 {/* Product Info */}
//                 <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
//                   <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden border border-green-200">
//                     {(product.product_img) ? (
//                       <img src={product.product_img} alt={product.product_name} className="w-full h-full object-cover" />
//                     ) : (
//                       <Package size={22} className="text-green-700" />
//                     )}
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold text-gray-800">{product.product_name}</p>
//                     {product.brand_name && (
//                       <p className="text-xs text-gray-500">{product.brand_name}</p>
//                     )}
//                     <p className="text-xs text-gray-400 mt-0.5">
//                       {product.category_name} {product.subcategory_name ? `› ${product.subcategory_name}` : ''}
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Variants Table */}
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="border-b border-gray-200">
//                         <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Variant</th>
//                         <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500">Price</th>
//                         <th className="text-center py-3 px-3 text-xs font-semibold text-blue-600">
//                           <div className="flex items-center justify-center gap-1">
//                             <ArrowUpDown size={12} />
//                             Sent
//                           </div>
//                         </th>
//                         <th className="text-center py-3 px-3 text-xs font-semibold text-green-600">Received</th>
//                         <th className="text-center py-3 px-3 text-xs font-semibold text-red-600">Missing</th>
//                         <th className="text-center py-3 px-3 text-xs font-semibold text-orange-600">Dispute</th>
//                         <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500">Current Stock</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(transfer.variants || []).map((v, vIdx) => (
//                         <React.Fragment key={v.variant_id || vIdx}>
//                           <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
//                             <td className="py-3 px-3">
//                               <p className="font-bold text-gray-800">{v.value}</p>
//                             </td>
//                             <td className="py-3 px-3 text-center">
//                               <div>
//                                 <p className="font-bold text-green-700 text-xs">₹{v.discount_price}</p>
//                                 {v.price !== v.discount_price && (
//                                   <p className="text-xs text-gray-400 line-through">₹{v.price}</p>
//                                 )}
//                               </div>
//                             </td>
//                             <td className="py-3 px-3 text-center">
//                               <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
//                                 {v.sent_qty || 0}
//                               </span>
//                             </td>
//                             <td className="py-3 px-3 text-center">
//                               <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-full bg-green-50 text-green-700 font-bold text-xs">
//                                 {v.received_qty || 0}
//                               </span>
//                             </td>
//                             <td className="py-3 px-3 text-center">
//                               {((v.missing_qty || 0) > 0) ? (
//                                 <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-full bg-red-50 text-red-700 font-bold text-xs">
//                                   {v.missing_qty}
//                                 </span>
//                               ) : (
//                                 <span className="text-gray-300">-</span>
//                               )}
//                             </td>
//                             <td className="py-3 px-3 text-center">
//                               {((v.dispute_qty || 0) > 0) ? (
//                                 <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-full bg-orange-50 text-orange-700 font-bold text-xs">
//                                   {v.dispute_qty}
//                                 </span>
//                               ) : (
//                                 <span className="text-gray-300">-</span>
//                               )}
//                             </td>
//                             <td className="py-3 px-3 text-center">
//                               <span className="text-xs font-bold text-gray-600">
//                                 {v.current_stock || 0}
//                               </span>
//                             </td>
//                           </tr>
                          
//                           {/* Dispute Images Row */}
//                           {((v.dispute_qty || 0) > 0) && (() => {
//                             const images = parseDisputeImages(v.dispute_image, v.dispute_images);
//                             if (images.length > 0) {
//                               return (
//                                 <tr key={`dispute-${v.variant_id}`}>
//                                   <td colSpan="7" className="py-3 px-3 bg-orange-50/50">
//                                     <div className="flex items-start gap-3">
//                                       <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 mt-2 min-w-[80px]">
//                                         <AlertTriangle size={14} />
//                                         Defective Items:
//                                       </div>
//                                       <div className="flex gap-2 flex-wrap">
//                                         {images.map((img, index) => (
//                                           <img
//                                             key={index}
//                                             src={img}
//                                             alt={`Defective ${index + 1}`}
//                                             className="w-16 h-16 rounded-lg object-cover border-2 border-orange-300 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-110 transform"
//                                             onClick={() => window.open(img, '_blank')}
//                                           />
//                                         ))}
//                                       </div>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               );
//                             }
//                             return null;
//                           })()}
//                         </React.Fragment>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
            
//             {/* Summary Footer */}
//             <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4 text-xs">
//                   <div className="flex items-center gap-1">
//                     <span className="text-gray-500">Total Sent:</span>
//                     <span className="font-bold text-blue-600">{totalSent}</span>
//                   </div>
//                   <div className="text-gray-300">|</div>
//                   <div className="flex items-center gap-1">
//                     <span className="text-gray-500">Received:</span>
//                     <span className="font-bold text-green-600">{totalReceived}</span>
//                   </div>
//                   <div className="text-gray-300">|</div>
//                   <div className="flex items-center gap-1">
//                     <span className="text-gray-500">Missing:</span>
//                     <span className="font-bold text-red-600">{totalSent - totalReceived}</span>
//                   </div>
//                 </div>
//                 <span className="text-xs text-gray-400">
//                   {totalVariants} variant{totalVariants !== 1 ? 's' : ''}
//                 </span>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };


// // ── Shared Components ─────────────────────────────────────────────────────────
// const StatusBadge = ({ status, getStatusText, getStatusColor }) => {
//   const text = getStatusText(status);
//   const color = getStatusColor(status);
//   return (
//     <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${color}15`, color }}>
//       {text}
//     </span>
//   );
// };

// const QtyChip = ({ label, value, color }) => (
//   <span className="px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-1" style={{ backgroundColor: `${color}15`, color }}>
//     {value || 0}
//     <span className="text-xs opacity-70">{label}</span>
//   </span>
// );

// const EmptyState = ({ message }) => (
//   <div className="flex flex-col items-center justify-center py-16 text-gray-400">
//     <Inbox size={48} className="mb-3 opacity-40" />
//     <p className="text-sm">{message}</p>
//   </div>
// );
// src/pages/stocks/StockHistory.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  RefreshCw,
  Package,
  Inbox,
  ChevronDown,
  ChevronUp,
  Clock,
  Building2,
  AlertTriangle,
  Loader,
  ArrowUpDown,
  MapPin,
  User,
  Hash,
} from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient, { ENDPOINTS } from '../../config/ApiConfig';
import { AppHeader } from './AppHeader';

const Colors = {
  primaryGreen: '#14532D',
  greenSoft: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
  bg: '#F4F6F9',
  warn: '#F59E0B',
  success: '#16A34A',
  error: '#DC2626',
  info: '#2563EB',
};

const ADMIN_STATUSES = ['All', 'Pending', 'Accepted', 'Completed'];
const HUB_STATUSES = ['All', 'Pending', 'Received', 'Completed'];
const SORT_OPTIONS = ['Newest', 'Oldest', 'Quantity: High', 'Quantity: Low'];

// ── CheckCircle SVG Icon ──────────────────────────────────────────────────────
const CheckCircle = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const StockHistory = () => {
  const [activeTab, setActiveTab] = useState(0); // 0=Admin, 1=Hub
  const [searchQuery, setSearchQuery] = useState('');
  const [adminStatus, setAdminStatus] = useState('All');
  const [hubStatus, setHubStatus] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Data states
  const [adminHistory, setAdminHistory] = useState(null);
  const [hubHistory, setHubHistory] = useState(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [isLoadingHub, setIsLoadingHub] = useState(false);

  // Fetch data
  const fetchAllData = useCallback(async () => {
    fetchAdminHistory();
    fetchHubHistory();
  }, []);

  const fetchAdminHistory = async () => {
    setIsLoadingAdmin(true);
    try {
      const response = await apiClient.get(ENDPOINTS.ADMIN_REQUEST_HISTORY);
      if (response.status === 200) {
        setAdminHistory(response.data?.data || []);
      }
    } catch (error) {
      toast.error('Failed to load admin history');
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const fetchHubHistory = async () => {
    setIsLoadingHub(true);
    try {
      const response = await apiClient.get(ENDPOINTS.HUB_HISTORY);
      if (response.status === 200) {
        setHubHistory(response.data?.data || []);
      }
    } catch (error) {
      toast.error('Failed to load hub history');
    } finally {
      setIsLoadingHub(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Status helpers
  const getAdminStatusText = (status) => {
    const s = parseInt(status);
    if (s === 0) return 'Pending';
    if (s === 1) return 'Accepted';
    if (s === 2) return 'Completed';
    return 'Unknown';
  };

  const getHubStatusText = (status) => {
    const s = parseInt(status);
    if (s === 0) return 'Pending';
    if (s === 1) return 'Received';
    if (s === 2) return 'Completed';
    return 'Unknown';
  };

  const getStatusColor = (status) => {
    const s = parseInt(status);
    if (s === 0) return Colors.warn;
    if (s === 1) return Colors.success;
    if (s === 2) return Colors.info;
    return Colors.textGrey;
  };

  const getStatusIcon = (status) => {
    const s = parseInt(status);
    if (s === 0) return <Clock size={14} />;
    if (s === 1) return <Package size={14} />;
    if (s === 2) return <CheckCircle size={14} />;
    return null;
  };

  // Filter and sort admin data
  const filteredAdminData = useMemo(() => {
    if (!adminHistory) return [];
    let result = [...adminHistory];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => {
        const productNames = (item.products || []).map(p => (p.product_name || p.productName || '').toLowerCase()).join(' ');
        return String(item.request_id || item.requestId).toLowerCase().includes(q) || productNames.includes(q);
      });
    }

    if (adminStatus !== 'All') {
      result = result.filter(item => getAdminStatusText(item.status) === adminStatus);
    }

    result.sort((a, b) => {
      const getTotalQty = (item) => (item.products || []).reduce((sum, p) => sum + (parseInt(p.requested_quantity || p.requestedQuantity) || 0), 0);
      const aDate = new Date(a.created_at || a.createdAt || 0);
      const bDate = new Date(b.created_at || b.createdAt || 0);

      switch (sortBy) {
        case 'Oldest': return aDate - bDate;
        case 'Quantity: High': return getTotalQty(b) - getTotalQty(a);
        case 'Quantity: Low': return getTotalQty(a) - getTotalQty(b);
        default: return bDate - aDate;
      }
    });

    return result;
  }, [adminHistory, searchQuery, adminStatus, sortBy]);

  // Flatten hub transfers for individual cards
  const flattenedHubTransfers = useMemo(() => {
    if (!hubHistory) return [];
    let transfers = [];

    hubHistory.forEach(product => {
      (product.transfers || []).forEach(transfer => {
        transfers.push({
          ...transfer,
          product: product
        });
      });
    });

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      transfers = transfers.filter(t => {
        return (t.hub_name || '').toLowerCase().includes(q) ||
          (t.product?.product_name || '').toLowerCase().includes(q) ||
          (t.hub_maneger_name || '').toLowerCase().includes(q) ||
          String(t.transfer_id).includes(q);
      });
    }

    // Filter by status
    if (hubStatus !== 'All') {
      transfers = transfers.filter(t => getHubStatusText(t.status) === hubStatus);
    }

    // Sort
    transfers.sort((a, b) => {
      const aDate = new Date(a.created_at || 0);
      const bDate = new Date(b.created_at || 0);
      const getTotalQty = (t) => (t.variants || []).reduce((sum, v) => sum + (parseInt(v.sent_qty) || 0), 0);

      switch (sortBy) {
        case 'Oldest': return aDate - bDate;
        case 'Quantity: High': return getTotalQty(b) - getTotalQty(a);
        case 'Quantity: Low': return getTotalQty(a) - getTotalQty(b);
        default: return bDate - aDate;
      }
    });

    return transfers;
  }, [hubHistory, searchQuery, hubStatus, sortBy]);

  const formatDate = (raw) => {
    try {
      const dt = new Date(raw);
      if (isNaN(dt)) return raw;
      const diff = Date.now() - dt;
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`;
    } catch { return raw; }
  };

  // Parse dispute images helper
  const parseDisputeImages = (disputeImage, disputeImages) => {
    if (disputeImages && Array.isArray(disputeImages) && disputeImages.length > 0) {
      return disputeImages;
    }
    
    if (disputeImage) {
      if (typeof disputeImage === 'string') {
        if (disputeImage.startsWith('[')) {
          try {
            const parsed = JSON.parse(disputeImage);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed;
            }
          } catch (e) {}
        }
        if (disputeImage.trim() && !disputeImage.startsWith('[')) {
          return [disputeImage];
        }
      } else if (Array.isArray(disputeImage) && disputeImage.length > 0) {
        return disputeImage;
      }
    }
    
    return [];
  };

  const currentStatuses = activeTab === 0 ? ADMIN_STATUSES : HUB_STATUSES;
  const currentStatus = activeTab === 0 ? adminStatus : hubStatus;

  return (
    <div className="flex flex-col h-143">
      <AppHeader
        title="History"
        subtitle="Track all your requests and transfers"
        actions={
          <button onClick={fetchAllData} className="p-2 rounded-lg hover:bg-gray-100">
            <RefreshCw size={20} className="text-gray-500" />
          </button>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Bar */}
        <div className="mx-4 mt-3 p-1 bg-gray-100 rounded-xl flex">
          {['Admin Requests', 'Hub Transfers'].map((label, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === i ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex gap-2 mx-4 mt-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 0 ? "Search by name, ID..." : "Search by hub, product, transfer ID..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-green-200"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X size={15} className="text-gray-400" />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Status Pills */}
        <div className="flex gap-2 mx-4 mt-3 overflow-x-auto pb-1">
          {currentStatuses.map((status) => (
            <button
              key={status}
              onClick={() => activeTab === 0 ? setAdminStatus(status) : setHubStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${currentStatus === status
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto mx-4 mt-3 mb-4">
          {activeTab === 0 ? (
            isLoadingAdmin ? (
              <div className="flex justify-center py-12"><Loader size={32} className="animate-spin text-green-800" /></div>
            ) : filteredAdminData.length === 0 ? (
              <EmptyState message="No requests found" />
            ) : (
              <div className="space-y-2.5">
                {filteredAdminData.map((item) => (
                  <AdminRequestCard 
                    key={item.request_id || item.requestId} 
                    item={item} 
                    getStatusText={getAdminStatusText} 
                    getStatusColor={getStatusColor} 
                    getStatusIcon={getStatusIcon}
                    formatDate={formatDate} 
                  />
                ))}
              </div>
            )
          ) : (
            isLoadingHub ? (
              <div className="flex justify-center py-12"><Loader size={32} className="animate-spin text-green-800" /></div>
            ) : flattenedHubTransfers.length === 0 ? (
              <EmptyState message="No transfers found" />
            ) : (
              <div className="space-y-2.5">
                {flattenedHubTransfers.map((transfer, i) => (
                  <HubTransferCard 
                    key={`${transfer.transfer_id}-${i}`} 
                    transfer={transfer} 
                    getStatusText={getHubStatusText} 
                    getStatusColor={getStatusColor} 
                    getStatusIcon={getStatusIcon}
                    formatDate={formatDate}
                    parseDisputeImages={parseDisputeImages}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// ── Admin Request Card ────────────────────────────────────────────────────────
const AdminRequestCard = ({ item, getStatusText, getStatusColor, getStatusIcon, formatDate }) => {
  const [expanded, setExpanded] = useState(false);
  const totalQty = (item.products || []).reduce((sum, p) => sum + (parseInt(p.requested_quantity || p.requestedQuantity) || 0), 0);
  const statusText = getStatusText(item.status);
  const statusColor = getStatusColor(item.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-3 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${statusColor}15` }}>
          <Package size={18} style={{ color: statusColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800">Request #{item.request_id || item.requestId}</p>
          <p className="text-xs text-gray-400">{(item.products || []).length} products</p>
        </div>
        <span className="text-xs font-semibold text-gray-600">Qty: {totalQty}</span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
          <ChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="border-t border-gray-100">
              {(item.products || []).map((product, idx) => (
                <div key={idx} className="p-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    {(product.product_img || product.productImg) && (
                      <img src={product.product_img || product.productImg} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{product.product_name || product.productName}</p>
                      <span className="text-xs font-bold text-green-800">x{product.requested_quantity || product.requestedQuantity}</span>
                    </div>
                  </div>
                  {(product.variants || []).map((v, vIdx) => (
                    <div key={vIdx} className="mt-2 ml-8 p-2 bg-gray-50 rounded-lg flex items-center gap-3">
                      {(v.variant_img || v.variantImg) && <img src={v.variant_img || v.variantImg} alt="" className="w-7 h-7 rounded object-cover" />}
                      <div className="flex-1">
                        <p className="text-xs font-semibold">{v.variant_value || v.variantValue}</p>
                        <p className="text-xs text-gray-400">SKU: {v.sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-green-800">₹{v.discount_price || v.discountPrice}</p>
                        {(v.price && v.price !== v.discount_price) && (
                          <p className="text-xs text-gray-400 line-through">₹{v.price}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
        <Clock size={12} className="text-gray-400" />
        <span className="text-xs text-gray-500">{formatDate(item.created_at || item.createdAt)}</span>
        <div className="flex-1" />
        <span className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1" style={{ backgroundColor: `${statusColor}15`, color: statusColor }}>
          {getStatusIcon(item.status)}
          {statusText}
        </span>
      </div>
    </div>
  );
};

// ── Hub Transfer Card (Hub-Focused) ───────────────────────────────────────────
const HubTransferCard = ({ transfer, getStatusText, getStatusColor, getStatusIcon, formatDate, parseDisputeImages }) => {
  const [expanded, setExpanded] = useState(false);
  
  const totalSent = (transfer.variants || []).reduce((sum, v) => sum + (parseInt(v.sent_qty) || 0), 0);
  const totalReceived = (transfer.variants || []).reduce((sum, v) => sum + (parseInt(v.received_qty) || 0), 0);
  const totalMissing = (transfer.variants || []).reduce((sum, v) => sum + (parseInt(v.missing_qty) || 0), 0);
  const totalDispute = (transfer.variants || []).reduce((sum, v) => sum + (parseInt(v.dispute_qty) || 0), 0);
  
  const statusText = getStatusText(transfer.status);
  const statusColor = getStatusColor(transfer.status);
  const product = transfer.product;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header - Hub Focused */}
      <div 
        className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors" 
        onClick={() => setExpanded(!expanded)}
      >
        {/* Hub Icon */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center border border-blue-200 flex-shrink-0">
          <Building2 size={22} className="text-blue-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Hub Name as Main Title */}
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-bold text-gray-800 truncate">{transfer.hub_name}</p>
            <span 
              className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"
              style={{ backgroundColor: `${statusColor}15`, color: statusColor }}
            >
              {getStatusIcon(transfer.status)}
              {statusText}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User size={11} />
              {transfer.hub_maneger_name}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <Hash size={11} />
              Transfer #{transfer.transfer_id}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Package size={12} className="text-gray-400" />
              <span className="font-bold text-gray-700">{totalSent}</span>
              <span>items</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Clock size={11} />
              {formatDate(transfer.created_at)}
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={20} className="text-gray-400" />
          </motion.div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200">
              {/* Hub Details Section */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Hub Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Hub Manager</p>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      <User size={13} />
                      {transfer.hub_maneger_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Pincode</p>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      <MapPin size={13} />
                      {transfer.pincode}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400 mb-0.5">Address</p>
                    <p className="text-sm font-medium text-gray-700">{transfer.hub_address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Transfer Date</p>
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                      <Clock size={13} />
                      {formatDate(transfer.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Transfer ID</p>
                    <p className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                      <Hash size={13} />
                      #{transfer.transfer_id}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Product Details */}
              <div className="p-4 bg-white">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Product Details</h4>
                
                {/* Product Info Card */}
                {product && (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden border border-green-200 flex-shrink-0">
                      {product.product_img ? (
                        <img src={product.product_img} alt={product.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={22} className="text-green-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">{product.product_name}</p>
                      {product.brand_name && (
                        <p className="text-xs text-gray-500">{product.brand_name}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">
                        {product.category_name}
                        {product.subcategory_name ? ` › ${product.subcategory_name}` : ''}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold">
                        {(transfer.variants || []).length} variant{(transfer.variants || []).length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Variants Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500">Variant</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500">Price</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-blue-600">
                          <div className="flex items-center justify-center gap-1">
                            <ArrowUpDown size={12} />
                            Sent
                          </div>
                        </th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-green-600">Received</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-red-600">Missing</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-orange-600">Dispute</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(transfer.variants || []).map((v, vIdx) => {
                        const images = parseDisputeImages(v.dispute_image, v.dispute_images);
                        
                        return (
                          <React.Fragment key={v.variant_id || vIdx}>
                            <tr className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  {v.variant_img ? (
                                    <img src={v.variant_img} alt={v.value} className="w-7 h-7 rounded object-cover" />
                                  ) : null}
                                  <p className="font-bold text-gray-800">{v.value}</p>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <div>
                                  <p className="font-bold text-green-700 text-xs">₹{v.discount_price}</p>
                                  {v.price !== v.discount_price && (
                                    <p className="text-xs text-gray-400 line-through">₹{v.price}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                                  {v.sent_qty || 0}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-full bg-green-50 text-green-700 font-bold text-xs">
                                  {v.received_qty || 0}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                {((v.missing_qty || 0) > 0) ? (
                                  <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-full bg-red-50 text-red-700 font-bold text-xs">
                                    {v.missing_qty}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-center">
                                {((v.dispute_qty || 0) > 0) ? (
                                  <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-full bg-orange-50 text-orange-700 font-bold text-xs">
                                    {v.dispute_qty}
                                  </span>
                                ) : (
                                  <span className="text-gray-300">-</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <span className="text-xs font-bold text-gray-600">
                                  {v.current_stock || 0}
                                </span>
                              </td>
                            </tr>
                            
                            {/* Dispute Images Row */}
                            {images.length > 0 && (
                              <tr>
                                <td colSpan="7" className="py-2 px-3 bg-orange-50/50">
                                  <div className="flex items-start gap-3">
                                    <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 mt-2 min-w-[80px]">
                                      <AlertTriangle size={14} />
                                      Defective:
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                      {images.map((img, index) => (
                                        <img
                                          key={index}
                                          src={img}
                                          alt={`Defective ${index + 1}`}
                                          className="w-16 h-16 rounded-lg object-cover border-2 border-orange-300 shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-110 transform"
                                          onClick={() => window.open(img, '_blank')}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Summary Footer */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Sent:</span>
                    <span className="font-bold text-blue-600">{totalSent}</span>
                  </div>
                  <div className="text-gray-300">|</div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Received:</span>
                    <span className="font-bold text-green-600">{totalReceived}</span>
                  </div>
                  {totalMissing > 0 && (
                    <>
                      <div className="text-gray-300">|</div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Missing:</span>
                        <span className="font-bold text-red-600">{totalMissing}</span>
                      </div>
                    </>
                  )}
                  {totalDispute > 0 && (
                    <>
                      <div className="text-gray-300">|</div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500">Dispute:</span>
                        <span className="font-bold text-orange-600">{totalDispute}</span>
                      </div>
                    </>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {(transfer.variants || []).length} variant{(transfer.variants || []).length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Empty State Component ─────────────────────────────────────────────────────
const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <Inbox size={48} className="mb-3 opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);