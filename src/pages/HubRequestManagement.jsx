// import React, { useState, useEffect, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Inbox,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Package,
//   Loader,
//   AlertTriangle,
//   Tag,
//   ChevronDown,
//   ShoppingBag,
//   Building2,
//   Calendar,
//   Send,
//   TrendingUp,
//   Minus,
//   Plus,
//   Edit2,
// } from 'lucide-react';
// import { useHubRequestViewModel } from '../hooks/useHubRequestViewModel';
// import toast from 'react-hot-toast';

// const FILTERS = {
//   all: 'All',
//   pending: 'Pending',
//   accepted: 'Accepted',
//   rejected: 'Rejected',
// };

// // ── Reject Modal Component ─────────────────────────────────────────────────────
// const RejectModal = ({ isOpen, onClose, onConfirm, isRejecting }) => {
//   const [rejectReason, setRejectReason] = useState('');
//   const [error, setError] = useState('');

//   const handleConfirm = () => {
//     if (!rejectReason.trim()) {
//       setError('Please provide a reason for rejection');
//       return;
//     }
//     setError('');
//     onConfirm(rejectReason);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
//       >
//         <div className="p-6">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//               <XCircle size={20} className="text-red-600" />
//             </div>
//             <div>
//               <h3 className="text-lg font-bold text-gray-800">Reject Request</h3>
//               <p className="text-sm text-gray-500">Please provide a reason for rejection</p>
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Rejection Reason <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               value={rejectReason}
//               onChange={(e) => {
//                 setRejectReason(e.target.value);
//                 if (e.target.value.trim()) setError('');
//               }}
//               placeholder="Enter reason for rejecting this request..."
//               rows={4}
//               className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none ${
//                 error ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//             {error && (
//               <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                 <AlertTriangle size={12} />
//                 {error}
//               </p>
//             )}
//           </div>

//           <div className="flex gap-3">
//             <button
//               onClick={onClose}
//               disabled={isRejecting}
//               className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleConfirm}
//               disabled={isRejecting}
//               className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
//             >
//               {isRejecting ? (
//                 <Loader size={18} className="animate-spin" />
//               ) : (
//                 <>
//                   <XCircle size={16} />
//                   Confirm Reject
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// // ── Main Component ─────────────────────────────────────────────────────────────
// export const HubRequestManagement = () => {
//   const {
//     requests,
//     isLoading,
//     isAccepting,
//     isRejecting,
//     isTransferring,
//     fetchRequests,
//     acceptRequest,
//     rejectRequest,
//     transferStockToHub,
//   } = useHubRequestViewModel();

//   const [filter, setFilter] = useState('all');
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [showTransferModal, setShowTransferModal] = useState(false);
//   const [transferringRequest, setTransferringRequest] = useState(null);
//   const [transferQuantities, setTransferQuantities] = useState({});
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectingRequestId, setRejectingRequestId] = useState(null);

//   useEffect(() => {
//     fetchRequests();
//   }, [fetchRequests]);

//   const getStatusString = (status) => {
//     switch (status?.toString()) {
//       case '1': return 'accepted';
//       case '2': return 'rejected';
//       default: return 'pending';
//     }
//   };

//   const filteredRequests = useMemo(() => {
//     if (filter === 'all') return requests;
//     return requests.filter(r => {
//       const status = getStatusString(r.status);
//       return status === filter;
//     });
//   }, [requests, filter]);

//   const counts = useMemo(() => ({
//     pending: requests.filter(r => getStatusString(r.status) === 'pending').length,
//     accepted: requests.filter(r => getStatusString(r.status) === 'accepted').length,
//     rejected: requests.filter(r => getStatusString(r.status) === 'rejected').length,
//     total: requests.length,
//   }), [requests]);

//   const getStatusConfig = (status) => {
//     const s = getStatusString(status);
//     switch (s) {
//       case 'accepted':
//         return {
//           color: 'text-green-700',
//           bg: 'bg-green-50',
//           border: 'border-green-300',
//           label: 'Accepted',
//           icon: CheckCircle
//         };
//       case 'rejected':
//         return {
//           color: 'text-red-700',
//           bg: 'bg-red-50',
//           border: 'border-red-300',
//           label: 'Rejected',
//           icon: XCircle
//         };
//       default:
//         return {
//           color: 'text-orange-700',
//           bg: 'bg-orange-50',
//           border: 'border-orange-300',
//           label: 'Pending',
//           icon: Clock
//         };
//     }
//   };

//   const getInitials = (name) => {
//     if (!name) return '?';
//     const parts = name.trim().split(' ');
//     if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
//     return name.substring(0, 2).toUpperCase();
//   };

//   const totalQty = (products) => {
//     return (products || []).reduce((sum, p) => {
//       if (p.variants && p.variants.length > 0) {
//         const variantSum = p.variants.reduce((vSum, v) => vSum + (parseInt(v.requested_quantity) || 0), 0);
//         return sum + variantSum;
//       }
//       return sum + (parseInt(p.requested_quantity) || 0);
//     }, 0);
//   };

//   const totalVariants = (products) => {
//     return (products || []).reduce((sum, p) => sum + (p.variants?.length || 0), 0);
//   };

//   const getUniqueCategories = (products) => {
//     return [...new Set((products || []).map(p => p.category_name).filter(Boolean))];
//   };

//   const formatDate = (raw) => {
//     try {
//       if (!raw) return 'N/A';
//       const dt = new Date(raw);
//       if (isNaN(dt.getTime())) return raw;

//       const today = new Date();
//       const diff = today - dt;
//       const hoursDiff = diff / (1000 * 60 * 60);

//       if (hoursDiff < 24) {
//         return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       } else if (hoursDiff < 48) {
//         return 'Yesterday';
//       } else {
//         return dt.toLocaleDateString([], { month: 'short', day: 'numeric' });
//       }
//     } catch {
//       return raw;
//     }
//   };

//   const getFullDate = (raw) => {
//     try {
//       if (!raw) return 'N/A';
//       const dt = new Date(raw);
//       if (isNaN(dt.getTime())) return raw;
//       return dt.toLocaleString([], {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch {
//       return raw;
//     }
//   };

//   // Get available stock (city stock)
//   const getAvailableStock = (variant) => {
//     return parseInt(variant.avail_city_stock) || 0;
//   };

//   // Initialize transfer quantities when modal opens
//   const initializeTransferQuantities = (request) => {
//     const quantities = {};
//     (request.products || []).forEach(product => {
//       if (product.variants && product.variants.length > 0) {
//         product.variants.forEach(variant => {
//           const key = `${product.product_id}_${variant.variant_id}`;
//           const requestedQty = parseInt(variant.requested_quantity) || 0;
//           const availableStock = getAvailableStock(variant);
//           // Default to min(requested, available) or 0 if no stock
//           quantities[key] = Math.min(requestedQty, availableStock);
//         });
//       } else {
//         const key = `${product.product_id}_no_variant`;
//         const requestedQty = parseInt(product.requested_quantity) || 0;
//         const availableStock = parseInt(product.avail_city_stock) || 0;
//         quantities[key] = Math.min(requestedQty, availableStock);
//       }
//     });
//     setTransferQuantities(quantities);
//   };

//   const updateTransferQuantity = (productId, variantId, newQty, requestedQty, availableStock) => {
//     const key = variantId ? `${productId}_${variantId}` : `${productId}_no_variant`;
//     // Ensure quantity doesn't exceed requested quantity or available stock
//     let validQty = Math.min(newQty, requestedQty, availableStock);
//     validQty = Math.max(0, validQty);

//     setTransferQuantities(prev => ({
//       ...prev,
//       [key]: validQty
//     }));
//   };

//   const incrementQty = (productId, variantId, requestedQty, availableStock) => {
//     const key = variantId ? `${productId}_${variantId}` : `${productId}_no_variant`;
//     const currentQty = transferQuantities[key] || 0;
//     if (currentQty < requestedQty && currentQty < availableStock) {
//       updateTransferQuantity(productId, variantId, currentQty + 1, requestedQty, availableStock);
//     } else {
//       toast.error(`Cannot exceed requested quantity (${requestedQty}) or available stock (${availableStock})`);
//     }
//   };

//   const decrementQty = (productId, variantId, requestedQty, availableStock) => {
//     const key = variantId ? `${productId}_${variantId}` : `${productId}_no_variant`;
//     const currentQty = transferQuantities[key] || 0;
//     if (currentQty > 0) {
//       updateTransferQuantity(productId, variantId, currentQty - 1, requestedQty, availableStock);
//     }
//   };

//   // Prepare items for transfer with user-selected quantities
//   const prepareTransferItems = (request) => {
//     const items = [];
//     (request.products || []).forEach(product => {
//       if (product.variants && product.variants.length > 0) {
//         product.variants.forEach(variant => {
//           const key = `${product.product_id}_${variant.variant_id}`;
//           const qty = transferQuantities[key] || 0;
//           if (qty > 0) {
//             items.push({
//               productid: product.product_id,
//               variantid: variant.variant_id,
//               qty: qty,
//             });
//           }
//         });
//       } else {
//         const key = `${product.product_id}_no_variant`;
//         const qty = transferQuantities[key] || 0;
//         if (qty > 0) {
//           items.push({
//             productid: product.product_id,
//             variantid: null,
//             qty: qty,
//           });
//         }
//       }
//     });
//     return items;
//   };

//   const handleTransferStock = async (request) => {
//     const items = prepareTransferItems(request);
//     const hubManagerId = request.hubmanager?.id;

//     if (!hubManagerId) {
//       toast.error('Hub manager ID not found');
//       return;
//     }

//     if (items.length === 0) {
//       toast.error('No items selected for transfer');
//       return;
//     }

//     setTransferringRequest(request);
//     const success = await transferStockToHub(request.request_id, hubManagerId, items);

//     if (success) {
//       setShowTransferModal(false);
//       setSelectedRequest(null);
//       setTransferQuantities({});
//     }

//     setTransferringRequest(null);
//   };

//   const getTotalTransferQuantity = () => {
//     return Object.values(transferQuantities).reduce((sum, qty) => sum + qty, 0);
//   };

//   // Handle reject with reason
//   const handleReject = async (requestId, rejectReason) => {
//     const success = await rejectRequest(requestId, rejectReason);
//     if (success) {
//       setShowRejectModal(false);
//       setRejectingRequestId(null);
//     }
//   };

//   // Loading state
//   if (isLoading && !requests.length) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="text-center">
//           <Loader size={48} className="animate-spin text-green-800 mx-auto mb-4" />
//           <p className="text-gray-500 text-sm">Loading requests...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full bg-gray-50">
//       {/* Split Layout */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* LEFT PANEL - Requests List */}
//         <div className="w-[55%] flex flex-col bg-white border-r border-gray-200">
//           {/* Filter Tabs */}
//           <div className="px-4 py-3 border-b border-gray-200">
//             <div className="flex gap-2 overflow-x-auto">
//               {Object.entries(FILTERS).map(([key, label]) => (
//                 <button
//                   key={key}
//                   onClick={() => setFilter(key)}
//                   className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${filter === key
//                       ? 'bg-green-800 text-white shadow-sm'
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                     }`}
//                 >
//                   {label}
//                   {key !== 'all' && counts[key] > 0 && (
//                     <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === key ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-700'
//                       }`}>
//                       {counts[key]}
//                     </span>
//                   )}
//                   {key === 'all' && counts.total > 0 && (
//                     <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === key ? 'bg-white/20 text-white' : 'bg-green-800 text-white'
//                       }`}>
//                       {counts.total}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Requests Scrollable List */}
//           <div className="flex-1 overflow-y-auto p-4">
//             {filteredRequests.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full text-gray-400">
//                 <Inbox size={64} className="mb-4 opacity-30" />
//                 <p className="text-sm font-medium">No requests found</p>
//                 <p className="text-xs mt-1">Try changing the filter</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 <AnimatePresence>
//                   {filteredRequests.map((req) => {
//                     const statusConfig = getStatusConfig(req.status);
//                     const hubName = req.hubmanager?.name || 'Unknown Hub';
//                     const categories = getUniqueCategories(req.products);
//                     const isSelected = selectedRequest?.request_id === req.request_id;
//                     const variantCount = totalVariants(req.products);
//                     const qtyTotal = totalQty(req.products);
//                     const StatusIcon = statusConfig.icon;

//                     return (
//                       <motion.div
//                         key={req.request_id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         onClick={() => setSelectedRequest(req)}
//                         className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${isSelected
//                             ? 'border-green-800 bg-green-50/30 shadow-lg'
//                             : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
//                           }`}
//                       >
//                         {/* Header */}
//                         <div className="flex items-start gap-3">
//                           <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border-2 flex-shrink-0 ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border
//                             }`}>
//                             {getInitials(hubName)}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 flex-wrap">
//                               <p className="text-base font-bold text-gray-800 truncate">{hubName}</p>
//                               <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}>
//                                 <StatusIcon size={12} />
//                                 {statusConfig.label}
//                               </span>
//                             </div>
//                             <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
//                               <Calendar size={12} />
//                               Request #{req.request_id} · {formatDate(req.created_at)}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Stats Badges */}
//                         <div className="flex flex-wrap gap-2 mt-3">
//                           {categories.slice(0, 3).map((cat, i) => (
//                             <span key={i} className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
//                               {cat}
//                             </span>
//                           ))}
//                           {categories.length > 3 && (
//                             <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium">
//                               +{categories.length - 3}
//                             </span>
//                           )}

//                           <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium flex items-center gap-1">
//                             <Package size={12} />
//                             {req.products.length} product{req.products.length !== 1 ? 's' : ''}
//                           </span>

//                           {variantCount > 0 && (
//                             <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium flex items-center gap-1">
//                               <Tag size={12} />
//                               {variantCount} variant{variantCount !== 1 ? 's' : ''}
//                             </span>
//                           )}

//                           <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium flex items-center gap-1">
//                             <ShoppingBag size={12} />
//                             {qtyTotal} units
//                           </span>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </AnimatePresence>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* RIGHT PANEL - Request Details */}
//         <div className="w-[45%] flex flex-col bg-gray-50/30">
//           <div className="px-5 py-3 bg-white border-b border-gray-200">
//             <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
//               <Building2 size={18} className="text-blue-600" />
//               Request Details
//             </h2>
//           </div>

//           {!selectedRequest ? (
//             <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
//               <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
//                 <Inbox size={40} className="text-blue-400" />
//               </div>
//               <p className="text-base font-bold text-gray-800">No Request Selected</p>
//               <p className="text-sm text-gray-500 mt-2 max-w-xs">
//                 Select a request from the left panel to view its detailed information here.
//               </p>
//             </div>
//           ) : (
//             <>
//               {/* Detail Content */}
//               <div className="flex-1 overflow-y-auto p-5">
//                 <DetailView
//                   request={selectedRequest}
//                   getStatusConfig={getStatusConfig}
//                   totalQty={totalQty}
//                   totalVariants={totalVariants}
//                   getFullDate={getFullDate}
//                 />
//               </div>

//               {/* Action Footer */}
//               <ActionFooter
//                 request={selectedRequest}
//                 isAccepting={isAccepting}
//                 isRejecting={isRejecting}
//                 onAccept={() => acceptRequest(selectedRequest.request_id)}
//                 onReject={() => {
//                   setRejectingRequestId(selectedRequest.request_id);
//                   setShowRejectModal(true);
//                 }}
//                 onTransfer={() => {
//                   initializeTransferQuantities(selectedRequest);
//                   setShowTransferModal(true);
//                 }}
//               />
//             </>
//           )}
//         </div>
//       </div>

//       {/* Reject Modal */}
//       <RejectModal
//         isOpen={showRejectModal}
//         onClose={() => {
//           setShowRejectModal(false);
//           setRejectingRequestId(null);
//         }}
//         onConfirm={(reason) => handleReject(rejectingRequestId, reason)}
//         isRejecting={isRejecting}
//       />

//       {/* Transfer Modal with Editable Quantities */}
//       {showTransferModal && selectedRequest && (
//         <TransferModal
//           request={selectedRequest}
//           transferQuantities={transferQuantities}
//           isTransferring={isTransferring && transferringRequest?.request_id === selectedRequest.request_id}
//           onIncrement={incrementQty}
//           onDecrement={decrementQty}
//           onQuantityChange={updateTransferQuantity}
//           onConfirm={() => handleTransferStock(selectedRequest)}
//           onCancel={() => {
//             setShowTransferModal(false);
//             setTransferQuantities({});
//           }}
//           totalTransferQty={getTotalTransferQuantity()}
//           getAvailableStock={getAvailableStock}
//         />
//       )}
//     </div>
//   );
// };

// // ── Detail View Component ─────────────────────────────────────────────────────
// const DetailView = ({ request, getStatusConfig, totalQty, totalVariants, getFullDate }) => {
//   const statusConfig = getStatusConfig(request.status);
//   const hubName = request.hubmanager?.name || '-';
//   const StatusIcon = statusConfig.icon;

//   return (
//     <div className="space-y-6">
//       {/* Summary Card */}
//       <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
//         <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
//           <Package size={14} />
//           Request Summary
//         </h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-gray-50 rounded-lg p-3">
//             <p className="text-xs text-gray-500 mb-1">Request ID</p>
//             <p className="text-lg font-bold text-gray-800">#{request.request_id}</p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-3">
//             <p className="text-xs text-gray-500 mb-1">Hub Manager</p>
//             <p className="text-sm font-bold text-gray-800 truncate">{hubName}</p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-3">
//             <p className="text-xs text-gray-500 mb-1">Products</p>
//             <p className="text-sm font-bold text-gray-800">{request.products?.length || 0}</p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-3">
//             <p className="text-xs text-gray-500 mb-1">Total Variants</p>
//             <p className="text-sm font-bold text-gray-800">{totalVariants(request.products)}</p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-3">
//             <p className="text-xs text-gray-500 mb-1">Total Quantity</p>
//             <p className="text-xl font-bold text-blue-600">{totalQty(request.products)} units</p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-3">
//             <p className="text-xs text-gray-500 mb-1">Status</p>
//             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}>
//               <StatusIcon size={12} />
//               {statusConfig.label}
//             </span>
//           </div>
//           <div className="col-span-2 bg-gray-50 rounded-lg p-3">
//             <p className="text-xs text-gray-500 mb-1">Requested On</p>
//             <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//               <Calendar size={14} className="text-gray-400" />
//               {getFullDate(request.created_at)}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Products Section */}
//       <div>
//         <div className="flex items-center gap-2 mb-3">
//           <ShoppingBag size={18} className="text-green-700" />
//           <h3 className="text-sm font-bold text-gray-700">Requested Products</h3>
//           <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
//             {request.products?.length || 0}
//           </span>
//         </div>

//         <div className="space-y-3">
//           {(request.products || []).map((product, idx) => (
//             <ProductCard key={idx} product={product} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ── Product Card Component ────────────────────────────────────────────────────
// const ProductCard = ({ product }) => {
//   const [expanded, setExpanded] = useState(false);
//   const hasVariants = (product.variants || []).length > 0;
//   const variantQty = (product.variants || []).reduce((sum, v) => sum + (parseInt(v.requested_quantity) || 0), 0);
//   const productQty = parseInt(product.requested_quantity) || 0;

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//       {/* Product Header */}
//       <div
//         className={`p-4 flex items-center gap-3 ${hasVariants ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
//         onClick={() => hasVariants && setExpanded(!expanded)}
//       >
//         {/* Product Image */}
//         <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden border border-green-200 flex-shrink-0">
//           {product.product_img ? (
//             <img src={product.product_img} alt={product.product_name} className="w-full h-full object-cover" />
//           ) : (
//             <Package size={24} className="text-green-700" />
//           )}
//         </div>

//         {/* Product Info */}
//         <div className="flex-1 min-w-0">
//           <p className="text-base font-bold text-gray-800 truncate">{product.product_name || 'Unknown Product'}</p>
//           <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
//             {product.category_name && (
//               <span className="px-1.5 py-0.5 bg-purple-50 rounded text-purple-600">{product.category_name}</span>
//             )}
//             {product.brand_name && (
//               <span className="px-1.5 py-0.5 bg-blue-50 rounded text-blue-600">{product.brand_name}</span>
//             )}
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="flex items-center gap-4 flex-shrink-0">
//           {hasVariants ? (
//             <>
//               <div className="text-right">
//                 <p className="text-xs text-gray-400">Variants</p>
//                 <p className="text-lg font-bold text-green-700">{product.variants.length}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs text-gray-400">Total Qty</p>
//                 <p className="text-lg font-bold text-blue-600">{variantQty}</p>
//               </div>
//               <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
//                 <ChevronDown size={20} className="text-gray-400" />
//               </motion.div>
//             </>
//           ) : (
//             <div className="text-right">
//               <p className="text-xs text-gray-400">Quantity</p>
//               <p className="text-lg font-bold text-blue-600">{productQty}</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Variants Expandable Section */}
//       <AnimatePresence>
//         {expanded && hasVariants && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: 'auto', opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="overflow-hidden"
//           >
//             <div className="border-t border-gray-200 bg-gray-50">
//               <div className="p-4 space-y-3">
//                 {(product.variants || []).map((variant, vIdx) => (
//                   <div
//                     key={vIdx}
//                     className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3 hover:border-green-300 transition-all shadow-sm"
//                   >
//                     {/* Variant Image */}
//                     <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden border border-blue-200 flex-shrink-0">
//                       {variant.variant_img ? (
//                         <img src={variant.variant_img} alt={variant.variant_value} className="w-full h-full object-cover" />
//                       ) : (
//                         <Tag size={20} className="text-blue-600" />
//                       )}
//                     </div>

//                     {/* Variant Details */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <p className="text-base font-bold text-gray-800">{variant.variant_value}</p>
//                         {variant.sku && (
//                           <span className="text-xs text-gray-400 font-mono">SKU: {variant.sku}</span>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-3 mt-2">
//                         {variant.discount_price && (
//                           <div className="flex items-center gap-2">
//                             <span className="text-xl font-bold text-green-700">₹{variant.discount_price}</span>
//                             {variant.price !== variant.discount_price && (
//                               <span className="text-sm text-gray-400 line-through">₹{variant.price}</span>
//                             )}
//                           </div>
//                         )}
//                         {variant.discount_percent > 0 && (
//                           <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 text-xs font-bold">
//                             {variant.discount_percent}% OFF
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Quantity Info */}
//                     <div className="text-right flex-shrink-0">
//                       <div className="bg-blue-50 rounded-lg px-3 py-1.5">
//                         <p className="text-xs text-gray-500">Requested</p>
//                         <p className="text-xl font-bold text-blue-600">{variant.requested_quantity || 0}</p>
//                       </div>
//                       <div className="mt-2 flex gap-2 text-xs">
//                         <span className={`px-2 py-1 rounded font-semibold ${(parseInt(variant.avail_city_stock) || 0) > 0
//                             ? 'bg-green-50 text-green-700'
//                             : 'bg-red-50 text-red-700'
//                           }`}>
//                           City: {variant.avail_city_stock || 0}
//                         </span>
//                         <span className={`px-2 py-1 rounded font-semibold ${(parseInt(variant.avail_hub_stock) || 0) > 0
//                             ? 'bg-green-50 text-green-700'
//                             : 'bg-red-50 text-red-700'
//                           }`}>
//                           Hub: {variant.avail_hub_stock || 0}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Variants Footer */}
//               <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 flex items-center justify-between text-xs">
//                 <span className="text-gray-600 font-medium">
//                   {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''} requested
//                 </span>
//                 <span className="font-bold text-blue-600">
//                   Total: {variantQty} units
//                 </span>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// // ── Action Footer Component ───────────────────────────────────────────────────
// const ActionFooter = ({ request, isAccepting, isRejecting, onAccept, onReject, onTransfer }) => {
//   const status = request?.status?.toString();
//   const isPending = status === '0' || !status || status === undefined;
//   const isAccepted = status === '1';

//   // Show transfer button for accepted requests
//   if (isAccepted) {
//     return (
//       <div className="bg-white border-t border-gray-200 p-5 shadow-lg">
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={onTransfer}
//           className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md"
//         >
//           <Send size={18} />
//           Transfer Stock to Hub
//         </motion.button>
//         <p className="text-xs text-gray-400 text-center mt-3">
//           Click to transfer stock (you can adjust quantities)
//         </p>
//       </div>
//     );
//   }

//   // Already rejected
//   if (status === '2') {
//     return (
//       <div className="mx-5 mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
//         <XCircle size={22} className="text-red-700" />
//         <div>
//           <p className="text-sm font-bold text-gray-800">Request Rejected</p>
//           <p className="text-xs text-gray-500 mt-0.5">This request has been rejected and cannot be processed.</p>
//         </div>
//       </div>
//     );
//   }

//   // Loading state for pending actions
//   if (isAccepting || isRejecting) {
//     return (
//       <div className="bg-white border-t border-gray-200 px-5 py-4 shadow-lg">
//         <div className="flex justify-center py-3">
//           <div className="flex items-center gap-3">
//             <Loader size={24} className="animate-spin text-green-800" />
//             <span className="text-sm font-medium text-gray-600">
//               {isAccepting ? 'Accepting request...' : 'Rejecting request...'}
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Pending - Show accept/reject buttons
//   return (
//     <div className="bg-white border-t border-gray-200 p-5 shadow-lg">
//       <div className="flex gap-3">
//         {/* Reject Button */}
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={onReject}
//           className="flex-1 py-3 rounded-xl bg-white text-red-600 font-bold text-sm flex items-center justify-center gap-2 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
//         >
//           <XCircle size={18} />
//           Reject Request
//         </motion.button>

//         {/* Accept Button */}
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={onAccept}
//           className="flex-[2] py-3 rounded-xl bg-green-700 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-all shadow-md"
//         >
//           <CheckCircle size={18} />
//           Accept Request
//         </motion.button>
//       </div>

//       <p className="text-xs text-gray-400 text-center mt-3">
//         Review all products and quantities before accepting
//       </p>
//     </div>
//   );
// };

// // ── Transfer Modal Component with Editable Quantities ─────────────────────────
// const TransferModal = ({
//   request,
//   transferQuantities,
//   isTransferring,
//   onIncrement,
//   onDecrement,
//   onQuantityChange,
//   onConfirm,
//   onCancel,
//   totalTransferQty,
//   getAvailableStock
// }) => {

//   const getRequestedQty = (variant) => {
//     return parseInt(variant.requested_quantity) || 0;
//   };

//   const getCurrentTransferQty = (productId, variantId) => {
//     const key = variantId ? `${productId}_${variantId}` : `${productId}_no_variant`;
//     return transferQuantities[key] || 0;
//   };

//   const getStockStatus = (available, requested) => {
//     if (available === 0) return 'out-of-stock';
//     if (available < requested) return 'partial';
//     return 'sufficient';
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//         className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col"
//       >
//         {/* Modal Header */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
//                 <TrendingUp size={24} className="text-blue-600" />
//               </div>
//               <div>
//                 <h3 className="text-lg font-bold text-gray-800">Transfer Stock to Hub</h3>
//                 <p className="text-sm text-gray-500">Adjust quantities before transferring</p>
//               </div>
//             </div>
//             <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
//               <XCircle size={24} />
//             </button>
//           </div>
//         </div>

//         {/* Modal Body - Scrollable */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {/* Request Info */}
//           <div className="bg-gray-50 rounded-lg p-4 mb-6">
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <p className="text-gray-500">Request ID</p>
//                 <p className="font-bold text-gray-800">#{request.request_id}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Hub Manager</p>
//                 <p className="font-bold text-gray-800">{request.hubmanager?.name || 'N/A'}</p>
//               </div>
//             </div>
//           </div>

//           {/* Stock Warning Banner */}
//           <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <div className="flex gap-2">
//               <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0" />
//               <p className="text-xs text-yellow-700">
//                 You can transfer only the quantity that is available in city stock out of the quantity requested by the Hub.
//                 To transfer a lower quantity, please use the controls provided below.
//               </p>
//             </div>
//           </div>

//           {/* Products with Editable Quantities */}
//           <div className="space-y-4">
//             <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
//               <Package size={16} />
//               Transfer Items (Adjust Quantities)
//             </h4>

//             {(request.products || []).map((product, pIdx) => (
//               <div key={pIdx} className="border border-gray-200 rounded-xl overflow-hidden">
//                 {/* Product Header */}
//                 <div className="p-3 bg-gray-50 border-b border-gray-200">
//                   <div className="flex items-center gap-2">
//                     {product.product_img ? (
//                       <img src={product.product_img} alt="" className="w-8 h-8 rounded-lg object-cover" />
//                     ) : (
//                       <Package size={16} className="text-gray-500" />
//                     )}
//                     <p className="font-bold text-gray-800 text-sm">{product.product_name}</p>
//                   </div>
//                 </div>

//                 {/* Variants with Quantity Controls */}
//                 <div className="p-3 space-y-3">
//                   {(product.variants && product.variants.length > 0 ? product.variants : [{
//                     variant_id: null,
//                     variant_value: 'Default',
//                     requested_quantity: product.requested_quantity,
//                     avail_city_stock: product.avail_city_stock,
//                     sku: product.sku
//                   }]).map((variant, vIdx) => {
//                     const variantId = variant.variant_id;
//                     const requestedQty = getRequestedQty(variant);
//                     const availableStock = getAvailableStock(variant);
//                     const currentTransferQty = getCurrentTransferQty(product.product_id, variantId);
//                     const stockStatus = getStockStatus(availableStock, requestedQty);

//                     return (
//                       <div key={vIdx} className="bg-white rounded-lg border border-gray-200 p-3">
//                         <div className="flex items-center justify-between mb-3">
//                           <div>
//                             <p className="font-semibold text-gray-800">{variant.variant_value || 'Default'}</p>
//                             {variant.sku && (
//                               <p className="text-xs text-gray-400">SKU: {variant.sku}</p>
//                             )}
//                           </div>
//                           <div className="text-right">
//                             <p className="text-xs text-gray-500">Requested</p>
//                             <p className="text-lg font-bold text-blue-600">{requestedQty}</p>
//                           </div>
//                         </div>

//                         {/* Stock Info */}
//                         <div className="flex items-center gap-2 mb-3 text-xs">
//                           <span className={`px-2 py-1 rounded font-semibold ${availableStock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
//                             }`}>
//                             Available Stock: {availableStock}
//                           </span>
//                           {stockStatus === 'partial' && (
//                             <span className="px-2 py-1 rounded bg-orange-50 text-orange-700 font-semibold">
//                               Partial Stock Available
//                             </span>
//                           )}
//                           {stockStatus === 'out-of-stock' && (
//                             <span className="px-2 py-1 rounded bg-red-50 text-red-700 font-semibold">
//                               Out of Stock
//                             </span>
//                           )}
//                         </div>

//                         {/* Quantity Controls */}
//                         <div className="flex items-center justify-between">
//                           <p className="text-sm text-gray-600">Transfer Quantity:</p>
//                           <div className="flex items-center gap-3">
//                             <button
//                               onClick={() => onDecrement(product.product_id, variantId, requestedQty, availableStock)}
//                               disabled={currentTransferQty <= 0 || availableStock === 0}
//                               className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
//                             >
//                               <Minus size={16} />
//                             </button>
//                             <input
//                               type="number"
//                               value={currentTransferQty}
//                               onChange={(e) => {
//                                 let val = parseInt(e.target.value) || 0;
//                                 onQuantityChange(product.product_id, variantId, val, requestedQty, availableStock);
//                               }}
//                               className="w-20 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                               min="0"
//                               max={Math.min(requestedQty, availableStock)}
//                               disabled={availableStock === 0}
//                             />
//                             <button
//                               onClick={() => onIncrement(product.product_id, variantId, requestedQty, availableStock)}
//                               disabled={currentTransferQty >= requestedQty || currentTransferQty >= availableStock || availableStock === 0}
//                               className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
//                             >
//                               <Plus size={16} className="text-blue-600" />
//                             </button>
//                           </div>
//                         </div>

//                         {/* Max limit warning */}
//                         {currentTransferQty < requestedQty && availableStock >= requestedQty && (
//                           <p className="text-xs text-gray-400 mt-2">
//                             You can transfer up to {requestedQty} units
//                           </p>
//                         )}
//                         {currentTransferQty < requestedQty && availableStock < requestedQty && availableStock > 0 && (
//                           <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
//                             <AlertTriangle size={12} />
//                             Only {availableStock} units available in city stock
//                           </p>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="p-6 border-t border-gray-200 bg-gray-50">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <p className="text-sm text-gray-600">Total Transfer Quantity:</p>
//               <p className="text-2xl font-bold text-blue-600">{totalTransferQty} units</p>
//             </div>
//             {totalTransferQty === 0 && (
//               <p className="text-xs text-red-500 flex items-center gap-1">
//                 <AlertTriangle size={14} />
//                 Please select at least one item to transfer
//               </p>
//             )}
//           </div>

//           <div className="flex gap-3">
//             <button
//               onClick={onCancel}
//               disabled={isTransferring}
//               className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onConfirm}
//               disabled={isTransferring || totalTransferQty === 0}
//               className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isTransferring ? (
//                 <Loader size={18} className="animate-spin" />
//               ) : (
//                 <Send size={18} />
//               )}
//               {isTransferring ? 'Transferring...' : `Transfer ${totalTransferQty} Units`}
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Loader,
  AlertTriangle,
  Tag,
  ChevronDown,
  ShoppingBag,
  Building2,
  Calendar,
  Send,
  TrendingUp,
  Minus,
  Plus,
  Edit2,
  Check,
} from 'lucide-react';
import { useHubRequestViewModel } from '../hooks/useHubRequestViewModel';
import toast from 'react-hot-toast';

const FILTERS = {
  all: 'All',
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  completed: 'Completed',
};

// ── Reject Modal Component ─────────────────────────────────────────────────────
const RejectModal = ({ isOpen, onClose, onConfirm, isRejecting }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    setError('');
    onConfirm(rejectReason);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Reject Request</h3>
              <p className="text-sm text-gray-500">Please provide a reason for rejection</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              placeholder="Enter reason for rejecting this request..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isRejecting}
              className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isRejecting}
              className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isRejecting ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <>
                  <XCircle size={16} />
                  Confirm Reject
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
export const HubRequestManagement = () => {
  const {
    requests,
    isLoading,
    isAccepting,
    isRejecting,
    isTransferring,
    fetchRequests,
    acceptRequest,
    rejectRequest,
    transferStockToHub,
  } = useHubRequestViewModel();

  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferringRequest, setTransferringRequest] = useState(null);
  const [transferQuantities, setTransferQuantities] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingRequestId, setRejectingRequestId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const getStatusString = (status) => {
    switch (status?.toString()) {
      case '1': return 'accepted';
      case '2': return 'rejected';
      case '3': return 'completed';
      default: return 'pending';
    }
  };

  const filteredRequests = useMemo(() => {
    if (filter === 'all') return requests;
    return requests.filter(r => {
      const status = getStatusString(r.status);
      return status === filter;
    });
  }, [requests, filter]);

  const counts = useMemo(() => ({
    pending: requests.filter(r => getStatusString(r.status) === 'pending').length,
    accepted: requests.filter(r => getStatusString(r.status) === 'accepted').length,
    rejected: requests.filter(r => getStatusString(r.status) === 'rejected').length,
    completed: requests.filter(r => getStatusString(r.status) === 'completed').length,
    total: requests.length,
  }), [requests]);

  const getStatusConfig = (status) => {
    const s = getStatusString(status);
    switch (s) {
      case 'accepted':
        return {
          color: 'text-blue-700',
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          label: 'Accepted',
          icon: CheckCircle
        };
      case 'rejected':
        return {
          color: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-300',
          label: 'Rejected',
          icon: XCircle
        };
      case 'completed':
        return {
          color: 'text-green-700',
          bg: 'bg-green-50',
          border: 'border-green-300',
          label: 'Completed',
          icon: Check
        };
      default:
        return {
          color: 'text-orange-700',
          bg: 'bg-orange-50',
          border: 'border-orange-300',
          label: 'Pending',
          icon: Clock
        };
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const totalQty = (products) => {
    return (products || []).reduce((sum, p) => {
      if (p.variants && p.variants.length > 0) {
        const variantSum = p.variants.reduce((vSum, v) => vSum + (parseInt(v.requested_quantity) || 0), 0);
        return sum + variantSum;
      }
      return sum + (parseInt(p.requested_quantity) || 0);
    }, 0);
  };

  const totalVariants = (products) => {
    return (products || []).reduce((sum, p) => sum + (p.variants?.length || 0), 0);
  };

  const getUniqueCategories = (products) => {
    return [...new Set((products || []).map(p => p.category_name).filter(Boolean))];
  };

  const formatDate = (raw) => {
    try {
      if (!raw) return 'N/A';
      const dt = new Date(raw);
      if (isNaN(dt.getTime())) return raw;

      const today = new Date();
      const diff = today - dt;
      const hoursDiff = diff / (1000 * 60 * 60);

      if (hoursDiff < 24) {
        return dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (hoursDiff < 48) {
        return 'Yesterday';
      } else {
        return dt.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch {
      return raw;
    }
  };

  const getFullDate = (raw) => {
    try {
      if (!raw) return 'N/A';
      const dt = new Date(raw);
      if (isNaN(dt.getTime())) return raw;
      return dt.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return raw;
    }
  };

  // Get available stock (city stock)
  const getAvailableStock = (variant) => {
    return parseInt(variant.avail_city_stock) || 0;
  };

  // Initialize transfer quantities when modal opens
  const initializeTransferQuantities = (request) => {
    const quantities = {};
    (request.products || []).forEach(product => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          const key = `${product.product_id}_${variant.variant_id}`;
          const requestedQty = parseInt(variant.requested_quantity) || 0;
          const availableStock = getAvailableStock(variant);
          // Default to min(requested, available) or 0 if no stock
          quantities[key] = Math.min(requestedQty, availableStock);
        });
      } else {
        const key = `${product.product_id}_no_variant`;
        const requestedQty = parseInt(product.requested_quantity) || 0;
        const availableStock = parseInt(product.avail_city_stock) || 0;
        quantities[key] = Math.min(requestedQty, availableStock);
      }
    });
    setTransferQuantities(quantities);
  };

  const updateTransferQuantity = (productId, variantId, newQty, requestedQty, availableStock) => {
    const key = variantId ? `${productId}_${variantId}` : `${productId}_no_variant`;
    // Ensure quantity doesn't exceed requested quantity or available stock
    let validQty = Math.min(newQty, requestedQty, availableStock);
    validQty = Math.max(0, validQty);

    setTransferQuantities(prev => ({
      ...prev,
      [key]: validQty
    }));
  };

  const incrementQty = (productId, variantId, requestedQty, availableStock) => {
    const key = variantId ? `${productId}_${variantId}` : `${productId}_no_variant`;
    const currentQty = transferQuantities[key] || 0;
    if (currentQty < requestedQty && currentQty < availableStock) {
      updateTransferQuantity(productId, variantId, currentQty + 1, requestedQty, availableStock);
    } else {
      toast.error(`Cannot exceed requested quantity (${requestedQty}) or available stock (${availableStock})`);
    }
  };

  const decrementQty = (productId, variantId, requestedQty, availableStock) => {
    const key = variantId ? `${productId}_${variantId}` : `${productId}_no_variant`;
    const currentQty = transferQuantities[key] || 0;
    if (currentQty > 0) {
      updateTransferQuantity(productId, variantId, currentQty - 1, requestedQty, availableStock);
    }
  };

  // Prepare items for transfer with user-selected quantities
  const prepareTransferItems = (request) => {
    const items = [];
    (request.products || []).forEach(product => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          const key = `${product.product_id}_${variant.variant_id}`;
          const qty = transferQuantities[key] || 0;
          if (qty > 0) {
            items.push({
              productid: product.product_id,
              variantid: variant.variant_id,
              qty: qty,
            });
          }
        });
      } else {
        const key = `${product.product_id}_no_variant`;
        const qty = transferQuantities[key] || 0;
        if (qty > 0) {
          items.push({
            productid: product.product_id,
            variantid: null,
            qty: qty,
          });
        }
      }
    });
    return items;
  };

  const handleTransferStock = async (request) => {
    const items = prepareTransferItems(request);
    const hubManagerId = request.hubmanager?.id;

    if (!hubManagerId) {
      toast.error('Hub manager ID not found');
      return;
    }

    if (items.length === 0) {
      toast.error('No items selected for transfer');
      return;
    }

    setTransferringRequest(request);
    const success = await transferStockToHub(request.request_id, hubManagerId, items);

    if (success) {
      setShowTransferModal(false);
      setSelectedRequest(null);
      setTransferQuantities({});
    }

    setTransferringRequest(null);
  };

  const getTotalTransferQuantity = () => {
    return Object.values(transferQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  // Handle reject with reason
  const handleReject = async (requestId, rejectReason) => {
    const success = await rejectRequest(requestId, rejectReason);
    if (success) {
      setShowRejectModal(false);
      setRejectingRequestId(null);
    }
  };

  // Loading state
  if (isLoading && !requests.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-green-800 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL - Requests List */}
        <div className="w-[55%] flex flex-col bg-white border-r border-gray-200">
          {/* Filter Tabs */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex gap-2 overflow-x-auto">
              {Object.entries(FILTERS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${filter === key
                      ? 'bg-green-800 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {label}
                  {key !== 'all' && counts[key] > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === key ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                      {counts[key]}
                    </span>
                  )}
                  {key === 'all' && counts.total > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${filter === key ? 'bg-white/20 text-white' : 'bg-green-800 text-white'
                      }`}>
                      {counts.total}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Requests Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Inbox size={64} className="mb-4 opacity-30" />
                <p className="text-sm font-medium">No requests found</p>
                <p className="text-xs mt-1">Try changing the filter</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredRequests.map((req) => {
                    const statusConfig = getStatusConfig(req.status);
                    const hubName = req.hubmanager?.name || 'Unknown Hub';
                    const categories = getUniqueCategories(req.products);
                    const isSelected = selectedRequest?.request_id === req.request_id;
                    const variantCount = totalVariants(req.products);
                    const qtyTotal = totalQty(req.products);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <motion.div
                        key={req.request_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => setSelectedRequest(req)}
                        className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${isSelected
                            ? 'border-green-800 bg-green-50/30 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                          }`}
                      >
                        {/* Header */}
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border-2 flex-shrink-0 ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border
                            }`}>
                            {getInitials(hubName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-base font-bold text-gray-800 truncate">{hubName}</p>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}>
                                <StatusIcon size={12} />
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Calendar size={12} />
                              Request #{req.request_id} · {formatDate(req.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Stats Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {categories.slice(0, 3).map((cat, i) => (
                            <span key={i} className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
                              {cat}
                            </span>
                          ))}
                          {categories.length > 3 && (
                            <span className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium">
                              +{categories.length - 3}
                            </span>
                          )}

                          <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium flex items-center gap-1">
                            <Package size={12} />
                            {req.products.length} product{req.products.length !== 1 ? 's' : ''}
                          </span>

                          {variantCount > 0 && (
                            <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium flex items-center gap-1">
                              <Tag size={12} />
                              {variantCount} variant{variantCount !== 1 ? 's' : ''}
                            </span>
                          )}

                          <span className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium flex items-center gap-1">
                            <ShoppingBag size={12} />
                            {qtyTotal} units
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - Request Details */}
        <div className="w-[45%] flex flex-col bg-gray-50/30">
          <div className="px-5 py-3 bg-white border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" />
              Request Details
            </h2>
          </div>

          {!selectedRequest ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
                <Inbox size={40} className="text-blue-400" />
              </div>
              <p className="text-base font-bold text-gray-800">No Request Selected</p>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Select a request from the left panel to view its detailed information here.
              </p>
            </div>
          ) : (
            <>
              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-5">
                <DetailView
                  request={selectedRequest}
                  getStatusConfig={getStatusConfig}
                  totalQty={totalQty}
                  totalVariants={totalVariants}
                  getFullDate={getFullDate}
                />
              </div>

              {/* Action Footer */}
              <ActionFooter
                request={selectedRequest}
                isAccepting={isAccepting}
                isRejecting={isRejecting}
                onAccept={() => acceptRequest(selectedRequest.request_id)}
                onReject={() => {
                  setRejectingRequestId(selectedRequest.request_id);
                  setShowRejectModal(true);
                }}
                onTransfer={() => {
                  initializeTransferQuantities(selectedRequest);
                  setShowTransferModal(true);
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <RejectModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectingRequestId(null);
        }}
        onConfirm={(reason) => handleReject(rejectingRequestId, reason)}
        isRejecting={isRejecting}
      />

      {/* Transfer Modal with Editable Quantities */}
      {showTransferModal && selectedRequest && (
        <TransferModal
          request={selectedRequest}
          transferQuantities={transferQuantities}
          isTransferring={isTransferring && transferringRequest?.request_id === selectedRequest.request_id}
          onIncrement={incrementQty}
          onDecrement={decrementQty}
          onQuantityChange={updateTransferQuantity}
          onConfirm={() => handleTransferStock(selectedRequest)}
          onCancel={() => {
            setShowTransferModal(false);
            setTransferQuantities({});
          }}
          totalTransferQty={getTotalTransferQuantity()}
          getAvailableStock={getAvailableStock}
        />
      )}
    </div>
  );
};

// ── Detail View Component ─────────────────────────────────────────────────────
const DetailView = ({ request, getStatusConfig, totalQty, totalVariants, getFullDate }) => {
  const statusConfig = getStatusConfig(request.status);
  const hubName = request.hubmanager?.name || '-';
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Package size={14} />
          Request Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Request ID</p>
            <p className="text-lg font-bold text-gray-800">#{request.request_id}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Hub Manager</p>
            <p className="text-sm font-bold text-gray-800 truncate">{hubName}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Products</p>
            <p className="text-sm font-bold text-gray-800">{request.products?.length || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Total Variants</p>
            <p className="text-sm font-bold text-gray-800">{totalVariants(request.products)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Total Quantity</p>
            <p className="text-xl font-bold text-blue-600">{totalQty(request.products)} units</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}>
              <StatusIcon size={12} />
              {statusConfig.label}
            </span>
          </div>
          <div className="col-span-2 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Requested On</p>
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar size={14} className="text-gray-400" />
              {getFullDate(request.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag size={18} className="text-green-700" />
          <h3 className="text-sm font-bold text-gray-700">Requested Products</h3>
          <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
            {request.products?.length || 0}
          </span>
        </div>

        <div className="space-y-3">
          {(request.products || []).map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Product Card Component ────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  const hasVariants = (product.variants || []).length > 0;
  const variantQty = (product.variants || []).reduce((sum, v) => sum + (parseInt(v.requested_quantity) || 0), 0);
  const productQty = parseInt(product.requested_quantity) || 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Product Header */}
      <div
        className={`p-4 flex items-center gap-3 ${hasVariants ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
        onClick={() => hasVariants && setExpanded(!expanded)}
      >
        {/* Product Image */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center overflow-hidden border border-green-200 flex-shrink-0">
          {product.product_img ? (
            <img src={product.product_img} alt={product.product_name} className="w-full h-full object-cover" />
          ) : (
            <Package size={24} className="text-green-700" />
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-gray-800 truncate">{product.product_name || 'Unknown Product'}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            {product.category_name && (
              <span className="px-1.5 py-0.5 bg-purple-50 rounded text-purple-600">{product.category_name}</span>
            )}
            {product.brand_name && (
              <span className="px-1.5 py-0.5 bg-blue-50 rounded text-blue-600">{product.brand_name}</span>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {hasVariants ? (
            <>
              <div className="text-right">
                <p className="text-xs text-gray-400">Variants</p>
                <p className="text-lg font-bold text-green-700">{product.variants.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Total Qty</p>
                <p className="text-lg font-bold text-blue-600">{variantQty}</p>
              </div>
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={20} className="text-gray-400" />
              </motion.div>
            </>
          ) : (
            <div className="text-right">
              <p className="text-xs text-gray-400">Quantity</p>
              <p className="text-lg font-bold text-blue-600">{productQty}</p>
            </div>
          )}
        </div>
      </div>

      {/* Variants Expandable Section */}
      <AnimatePresence>
        {expanded && hasVariants && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 bg-gray-50">
              <div className="p-4 space-y-3">
                {(product.variants || []).map((variant, vIdx) => (
                  <div
                    key={vIdx}
                    className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3 hover:border-green-300 transition-all shadow-sm"
                  >
                    {/* Variant Image */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden border border-blue-200 flex-shrink-0">
                      {variant.variant_img ? (
                        <img src={variant.variant_img} alt={variant.variant_value} className="w-full h-full object-cover" />
                      ) : (
                        <Tag size={20} className="text-blue-600" />
                      )}
                    </div>

                    {/* Variant Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-base font-bold text-gray-800">{variant.variant_value}</p>
                        {variant.sku && (
                          <span className="text-xs text-gray-400 font-mono">SKU: {variant.sku}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {variant.discount_price && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-green-700">₹{variant.discount_price}</span>
                            {variant.price !== variant.discount_price && (
                              <span className="text-sm text-gray-400 line-through">₹{variant.price}</span>
                            )}
                          </div>
                        )}
                        {variant.discount_percent > 0 && (
                          <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 text-xs font-bold">
                            {variant.discount_percent}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Info */}
                    <div className="text-right flex-shrink-0">
                      <div className="bg-blue-50 rounded-lg px-3 py-1.5">
                        <p className="text-xs text-gray-500">Requested</p>
                        <p className="text-xl font-bold text-blue-600">{variant.requested_quantity || 0}</p>
                      </div>
                      <div className="mt-2 flex gap-2 text-xs">
                        <span className={`px-2 py-1 rounded font-semibold ${(parseInt(variant.avail_city_stock) || 0) > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                          }`}>
                          City: {variant.avail_city_stock || 0}
                        </span>
                        <span className={`px-2 py-1 rounded font-semibold ${(parseInt(variant.avail_hub_stock) || 0) > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                          }`}>
                          Hub: {variant.avail_hub_stock || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Variants Footer */}
              <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">
                  {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''} requested
                </span>
                <span className="font-bold text-blue-600">
                  Total: {variantQty} units
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Action Footer Component ───────────────────────────────────────────────────
const ActionFooter = ({ request, isAccepting, isRejecting, onAccept, onReject, onTransfer }) => {
  const status = request?.status?.toString();
  const isPending = status === '0' || !status || status === undefined;
  const isAccepted = status === '1';
  const isCompleted = status === '3';

  // Show transfer button for accepted requests
  if (isAccepted) {
    return (
      <div className="bg-white border-t border-gray-200 p-5 shadow-lg">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onTransfer}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md"
        >
          <Send size={18} />
          Transfer Stock to Hub
        </motion.button>
        <p className="text-xs text-gray-400 text-center mt-3">
          Click to transfer stock (you can adjust quantities)
        </p>
      </div>
    );
  }

  // Show completed status
  if (isCompleted) {
    return (
      <div className="mx-5 mb-5 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
        <Check size={22} className="text-green-700" />
        <div>
          <p className="text-sm font-bold text-gray-800">Request Completed</p>
          <p className="text-xs text-gray-500 mt-0.5">This request has been completed successfully.</p>
        </div>
      </div>
    );
  }

  // Already rejected
  if (status === '2') {
    return (
      <div className="mx-5 mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
        <XCircle size={22} className="text-red-700" />
        <div>
          <p className="text-sm font-bold text-gray-800">Request Rejected</p>
          <p className="text-xs text-gray-500 mt-0.5">This request has been rejected and cannot be processed.</p>
        </div>
      </div>
    );
  }

  // Loading state for pending actions
  if (isAccepting || isRejecting) {
    return (
      <div className="bg-white border-t border-gray-200 px-5 py-4 shadow-lg">
        <div className="flex justify-center py-3">
          <div className="flex items-center gap-3">
            <Loader size={24} className="animate-spin text-green-800" />
            <span className="text-sm font-medium text-gray-600">
              {isAccepting ? 'Accepting request...' : 'Rejecting request...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Pending - Show accept/reject buttons
  return (
    <div className="bg-white border-t border-gray-200 p-5 shadow-lg">
      <div className="flex gap-3">
        {/* Reject Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReject}
          className="flex-1 py-3 rounded-xl bg-white text-red-600 font-bold text-sm flex items-center justify-center gap-2 border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all"
        >
          <XCircle size={18} />
          Reject Request
        </motion.button>

        {/* Accept Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAccept}
          className="flex-[2] py-3 rounded-xl bg-green-700 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-all shadow-md"
        >
          <CheckCircle size={18} />
          Accept Request
        </motion.button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">
        Review all products and quantities before accepting
      </p>
    </div>
  );
};

// ── Transfer Modal Component with Editable Quantities ─────────────────────────
const TransferModal = ({
  request,
  transferQuantities,
  isTransferring,
  onIncrement,
  onDecrement,
  onQuantityChange,
  onConfirm,
  onCancel,
  totalTransferQty,
  getAvailableStock
}) => {

  const getRequestedQty = (variant) => {
    return parseInt(variant.requested_quantity) || 0;
  };

  const getCurrentTransferQty = (productId, variantId) => {
    const key = variantId ? `${productId}_${variantId}` : `${productId}_no_variant`;
    return transferQuantities[key] || 0;
  };

  const getStockStatus = (available, requested) => {
    if (available === 0) return 'out-of-stock';
    if (available < requested) return 'partial';
    return 'sufficient';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Transfer Stock to Hub</h3>
                <p className="text-sm text-gray-500">Adjust quantities before transferring</p>
              </div>
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <XCircle size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Request Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Request ID</p>
                <p className="font-bold text-gray-800">#{request.request_id}</p>
              </div>
              <div>
                <p className="text-gray-500">Hub Manager</p>
                <p className="font-bold text-gray-800">{request.hubmanager?.name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Stock Warning Banner */}
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex gap-2">
              <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0" />
              <p className="text-xs text-yellow-700">
                You can transfer only the quantity that is available in city stock out of the quantity requested by the Hub.
                To transfer a lower quantity, please use the controls provided below.
              </p>
            </div>
          </div>

          {/* Products with Editable Quantities */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Package size={16} />
              Transfer Items (Adjust Quantities)
            </h4>

            {(request.products || []).map((product, pIdx) => (
              <div key={pIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Product Header */}
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    {product.product_img ? (
                      <img src={product.product_img} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <Package size={16} className="text-gray-500" />
                    )}
                    <p className="font-bold text-gray-800 text-sm">{product.product_name}</p>
                  </div>
                </div>

                {/* Variants with Quantity Controls */}
                <div className="p-3 space-y-3">
                  {(product.variants && product.variants.length > 0 ? product.variants : [{
                    variant_id: null,
                    variant_value: 'Default',
                    requested_quantity: product.requested_quantity,
                    avail_city_stock: product.avail_city_stock,
                    sku: product.sku
                  }]).map((variant, vIdx) => {
                    const variantId = variant.variant_id;
                    const requestedQty = getRequestedQty(variant);
                    const availableStock = getAvailableStock(variant);
                    const currentTransferQty = getCurrentTransferQty(product.product_id, variantId);
                    const stockStatus = getStockStatus(availableStock, requestedQty);

                    return (
                      <div key={vIdx} className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-800">{variant.variant_value || 'Default'}</p>
                            {variant.sku && (
                              <p className="text-xs text-gray-400">SKU: {variant.sku}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Requested</p>
                            <p className="text-lg font-bold text-blue-600">{requestedQty}</p>
                          </div>
                        </div>

                        {/* Stock Info */}
                        <div className="flex items-center gap-2 mb-3 text-xs">
                          <span className={`px-2 py-1 rounded font-semibold ${availableStock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            Available Stock: {availableStock}
                          </span>
                          {stockStatus === 'partial' && (
                            <span className="px-2 py-1 rounded bg-orange-50 text-orange-700 font-semibold">
                              Partial Stock Available
                            </span>
                          )}
                          {stockStatus === 'out-of-stock' && (
                            <span className="px-2 py-1 rounded bg-red-50 text-red-700 font-semibold">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">Transfer Quantity:</p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => onDecrement(product.product_id, variantId, requestedQty, availableStock)}
                              disabled={currentTransferQty <= 0 || availableStock === 0}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              value={currentTransferQty}
                              onChange={(e) => {
                                let val = parseInt(e.target.value) || 0;
                                onQuantityChange(product.product_id, variantId, val, requestedQty, availableStock);
                              }}
                              className="w-20 h-10 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              min="0"
                              max={Math.min(requestedQty, availableStock)}
                              disabled={availableStock === 0}
                            />
                            <button
                              onClick={() => onIncrement(product.product_id, variantId, requestedQty, availableStock)}
                              disabled={currentTransferQty >= requestedQty || currentTransferQty >= availableStock || availableStock === 0}
                              className="w-8 h-8 rounded-lg bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <Plus size={16} className="text-blue-600" />
                            </button>
                          </div>
                        </div>

                        {/* Max limit warning */}
                        {currentTransferQty < requestedQty && availableStock >= requestedQty && (
                          <p className="text-xs text-gray-400 mt-2">
                            You can transfer up to {requestedQty} units
                          </p>
                        )}
                        {currentTransferQty < requestedQty && availableStock < requestedQty && availableStock > 0 && (
                          <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Only {availableStock} units available in city stock
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Total Transfer Quantity:</p>
              <p className="text-2xl font-bold text-blue-600">{totalTransferQty} units</p>
            </div>
            {totalTransferQty === 0 && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle size={14} />
                Please select at least one item to transfer
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isTransferring}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isTransferring || totalTransferQty === 0}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTransferring ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              {isTransferring ? 'Transferring...' : `Transfer ${totalTransferQty} Units`}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};