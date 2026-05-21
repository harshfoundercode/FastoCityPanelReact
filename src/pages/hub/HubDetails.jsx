// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft, MapPin, User, Phone, Mail, Building2, TrendingUp,
//   Package, CheckCircle, XCircle, Clock, Truck, AlertCircle,
//   Star, Navigation, RefreshCw, CreditCard, FileText, Shield,
//   Loader, Copy, Check, ExternalLink, Send, Share2,
// } from 'lucide-react';
// import { useHubDetailsViewModel } from '../../hooks/HubDetailsViewModel';
// import { useEditHubViewModel } from '../../hooks/useHubEditViewModel';
// import toast from 'react-hot-toast';

// const Colors = {
//   primaryGreen: '#14532D',
//   primaryExtraLightGreen: '#F0FDF4',
//   textBlack: '#1F2937',
//   textGrey1: '#6B7280',
// };

// export const HubDetails = () => {
//   const { hubId } = useParams();
//   const navigate = useNavigate();
//   const { hubDetails, isLoading, error, fetchHubDetails } = useHubDetailsViewModel();
//   const { hubProfile, isLoading: profileLoading, fetchHubProfile } = useEditHubViewModel();
  
//   // Copy states
//   const [copiedField, setCopiedField] = useState(null);

//   useEffect(() => {
//     if (hubId) {
//       fetchHubDetails(hubId);
//       fetchHubProfile(hubId);
//     }
//   }, [hubId]);

//   // ✅ Copy to clipboard function
//   const copyToClipboard = async (text, fieldName) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopiedField(fieldName);
//       toast.success(`${fieldName} copied!`);
//       setTimeout(() => setCopiedField(null), 2000);
//     } catch (err) {
//       // Fallback for older browsers
//       const textArea = document.createElement('textarea');
//       textArea.value = text;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       setCopiedField(fieldName);
//       toast.success(`${fieldName} copied!`);
//       setTimeout(() => setCopiedField(null), 2000);
//     }
//   };

//   // ✅ Copy all login details for sharing
//   const copyAllLoginDetails = async () => {
//     const hubUrl = "https://startling-kitsune-c41a2b.netlify.app/";
//     const loginDetails = `🔐 Hub Manager Login Details\n\n` +
//       `🌐 URL: ${hubUrl}\n` +
//       `📧 Email: ${hubProfile?.email || 'N/A'}\n` +
//       `🔑 Password: ${hubProfile?.password || 'N/A'}\n` +
//       `🏢 Hub: ${hubDetails?.hub?.hub_name || 'N/A'}\n` +
//       `👤 Manager: ${hubProfile?.name || 'N/A'}\n\n`

//     try {
//       await navigator.clipboard.writeText(loginDetails);
//       toast.success('All login details copied! Ready to share.');
//     } catch (err) {
//       const textArea = document.createElement('textarea');
//       textArea.value = loginDetails;
//       document.body.appendChild(textArea);
//       textArea.select();
//       document.execCommand('copy');
//       document.body.removeChild(textArea);
//       toast.success('All login details copied! Ready to share.');
//     }
//   };

//   // ✅ Share via WhatsApp
//   const shareViaWhatsApp = () => {
//     const hubUrl = window.location.origin + '/login';
//     const message = `🔐 *Hub Manager Login Details*%0A%0A` +
//       `🌐 *URL:* ${hubUrl}%0A` +
//       `📧 *Email:* ${hubProfile?.email || 'N/A'}%0A` +
//       `🔑 *Password:* ${hubProfile?.password || 'N/A'}%0A` +
//       `🏢 *Hub:* ${hubDetails?.hub?.hub_name || 'N/A'}%0A` +
//       `👤 *Manager:* ${hubProfile?.name || 'N/A'}%0A%0A` +
//       `Powered by City Panel`;
    
//     window.open(`https://wa.me/?text=${message}`, '_blank');
//   };

//   // Format phone
//   const formatPhone = (phone) => {
//     if (!phone) return 'N/A';
//     return phone?.replace(/(\d{3})(\d{3})(\d{4})/, '+91 $1-$2-$3');
//   };

//   const formatAadhar = (number) => {
//     if (!number) return 'N/A';
//     const str = String(number);
//     return `XXXX XXXX ${str.slice(-4)}`;
//   };

//   // Loading
//   if (isLoading && profileLoading) {
//     return (
//       <div className="space-y-6 animate-pulse">
//         <div className="h-10 w-32 bg-gray-200 rounded-lg" />
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
//           <div className="grid grid-cols-3 gap-4">
//             {[1, 2, 3].map((i) => (<div key={i} className="h-24 bg-gray-200 rounded-xl" />))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center py-16">
//         <AlertCircle size={32} className="text-red-500 mb-4" />
//         <h2 className="text-lg font-semibold mb-2 text-gray-900">Failed to Load Hub Details</h2>
//         <p className="text-sm mb-4 text-gray-500">{error}</p>
//         <button onClick={() => { fetchHubDetails(hubId); fetchHubProfile(hubId); }}
//           className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-green-800">
//           <RefreshCw size={16} /> Retry
//         </button>
//       </div>
//     );
//   }

//   if (!hubDetails) return null;

//   return (
//     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      
//       {/* Back Button */}
//       <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
//         onClick={() => navigate('/hubs/all-hubs')}
//         className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium hover:bg-gray-50">
//         <ArrowLeft size={18} /> Back to Hubs
//       </motion.button>

//       {/* Hub Header */}
//       <div className="bg-gradient-to-br from-[#166534] to-[#14532D] rounded-2xl p-6 text-white shadow-lg">
//         <div className="flex items-start justify-between">
//           <div>
//             <div className="flex items-center gap-2 mb-2">
//               <Building2 size={20} className="text-white/80" />
//               <h1 className="text-2xl font-bold capitalize">{hubDetails.hub?.hub_name}</h1>
//             </div>
//             <div className="flex items-center gap-2 text-white/80">
//               <MapPin size={16} />
//               <p className="text-sm">{hubDetails.hub?.city_name}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Share Actions Bar */}
//       {hubProfile && (
//         <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
//           <div className="flex items-center gap-3">
//             <Share2 size={18} className="text-green-800" />
//             <span className="text-sm font-bold text-gray-800">Share Login Credentials</span>
//             <div className="flex-1" />
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={copyAllLoginDetails}
//                 className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-800 text-xs font-bold hover:bg-green-100 transition-colors border border-green-200"
//               >
//                 <Copy size={14} />
//                 Copy All
//               </button>
//               <button
//                 onClick={shareViaWhatsApp}
//                 className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors"
//               >
//                 <Send size={14} />
//                 WhatsApp
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Hub Information & Manager Details */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="w-1 h-5 rounded-full bg-green-700" />
//             <h2 className="text-lg font-bold text-gray-900">Hub Information</h2>
//           </div>
//           <div className="space-y-4">
//             <InfoRow icon={<Building2 size={18} />} label="Hub Name" value={hubDetails.hub?.hub_name} />
//             <InfoRow icon={<Navigation size={18} />} label="City" value={hubDetails.hub?.city_name} />
//             <InfoRow icon={<MapPin size={18} />} label="Full Address" value={hubDetails.hub?.address} />
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="w-1 h-5 rounded-full bg-green-700" />
//             <h2 className="text-lg font-bold text-gray-900">Manager Details</h2>
//           </div>
//           <div className="space-y-4">
//             <InfoRow icon={<User size={18} />} label="Manager Name" value={hubDetails.hub?.manager_name} />
//             <InfoRow icon={<Phone size={18} />} label="Phone" value={formatPhone(hubDetails.hub?.manager_phone)} />
//           </div>
//         </div>
//       </div>

//       {/* ✅ Hub Manager Profile with Copy Buttons */}
//       {hubProfile && (
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="w-1 h-5 rounded-full bg-green-700" />
//             <h2 className="text-lg font-bold text-gray-900">Hub Manager Profile</h2>
//           </div>
          
//           {profileLoading ? (
//             <div className="flex justify-center py-8"><Loader size={24} className="animate-spin text-green-800" /></div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Name */}
//               <CopyableInfoRow icon={<User size={18} />} label="Name" value={hubProfile.name} color="#8B5CF6" bg="bg-purple-50" />

//               {/* Email with Copy */}
//               <CopyableInfoRow 
//                 icon={<Mail size={18} />} label="Email" value={hubProfile.email} color="#3B82F6" bg="bg-blue-50"
//                 copyable copyValue={hubProfile.email} fieldName="Email"
//                 copied={copiedField === 'Email'} onCopy={copyToClipboard}
//               />

//               {/* Phone */}
//               <CopyableInfoRow icon={<Phone size={18} />} label="Phone" value={formatPhone(hubProfile.phone)} color="#14532D" bg="bg-green-50" />

//               {/* Password with Copy */}
//               <CopyableInfoRow 
//                 icon={<Shield size={18} />} label="Password" value={hubProfile.password || 'N/A'} color="#DC2626" bg="bg-red-50"
//                 copyable copyValue={hubProfile.password} fieldName="Password"
//                 copied={copiedField === 'Password'} onCopy={copyToClipboard}
//               />

//               {/* Address */}
//               <CopyableInfoRow icon={<MapPin size={18} />} label="Address" value={hubProfile.address} color="#F59E0B" bg="bg-orange-50" />

//               {/* Aadhar */}
//               <CopyableInfoRow icon={<CreditCard size={18} />} label="Aadhar Number" value={formatAadhar(hubProfile.adharno)} color="#0891B2" bg="bg-cyan-50" />

//               {/* PAN */}
//               <CopyableInfoRow icon={<FileText size={18} />} label="PAN Number" value={hubProfile.panno} color="#7C3AED" bg="bg-violet-50" />

//               {/* Hub Name */}
//               {hubProfile.hub_details && (
//                 <CopyableInfoRow icon={<Building2 size={18} />} label="Hub Name" value={hubProfile.hub_details.hub_name} color="#059669" bg="bg-emerald-50" />
//               )}

//               {/* Status */}
//               {hubProfile.hub_details && (
//                 <CopyableInfoRow 
//                   icon={<CheckCircle size={18} />} label="Status" 
//                   value={hubProfile.hub_details.status === 0 ? 'Active' : 'Inactive'}
//                   color={hubProfile.hub_details.status === 0 ? '#16A34A' : '#DC2626'}
//                   bg={hubProfile.hub_details.status === 0 ? 'bg-green-50' : 'bg-red-50'}
//                 />
//               )}
//             </div>
//           )}

//           {/* Performance Stats */}
//           {hubProfile.performance_stats && (
//             <div className="mt-6">
//               <div className="flex items-center gap-2 mb-3">
//                 <div className="w-1 h-4 rounded-full bg-green-700" />
//                 <h3 className="text-sm font-bold text-gray-900">Performance Stats</h3>
//               </div>
//               <div className="grid grid-cols-3 gap-3">
//                 <div className="bg-blue-50 rounded-xl p-3 text-center">
//                   <p className="text-lg font-bold text-gray-900">{hubProfile.performance_stats.managed_orders || '0'}</p>
//                   <p className="text-xs text-gray-500">Managed Orders</p>
//                 </div>
//                 <div className="bg-purple-50 rounded-xl p-3 text-center">
//                   <p className="text-lg font-bold text-gray-900">{hubProfile.performance_stats.active_staff || '0'}</p>
//                   <p className="text-xs text-gray-500">Active Staff</p>
//                 </div>
//                 <div className="bg-orange-50 rounded-xl p-3 text-center">
//                   <p className="text-lg font-bold text-gray-900">{hubProfile.performance_stats.punctuality || '0%'}</p>
//                   <p className="text-xs text-gray-500">Punctuality</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Performance Metrics */}
//       <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//         <div className="flex items-center gap-2 mb-6">
//           <div className="w-1 h-5 rounded-full bg-green-700" />
//           <h2 className="text-lg font-bold text-gray-900">Performance Metrics</h2>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           <MetricCard icon={<Package size={24} />} value={hubDetails.performance?.total_orders || 0} label="Total Orders" color="#3B82F6" bg="bg-blue-50" />
//           <MetricCard icon={<CheckCircle size={24} />} value={hubDetails.performance?.completed_deliveries || 0} label="Completed" color="#10B981" bg="bg-green-50" />
//           <MetricCard icon={<XCircle size={24} />} value={hubDetails.performance?.cancelled_orders || 0} label="Cancelled" color="#DC2626" bg="bg-red-50" />
//           <MetricCard icon={<TrendingUp size={24} />} value={hubDetails.performance?.success_rate ? `${hubDetails.performance.success_rate}%` : 'N/A'} label="Success Rate" color="#8B5CF6" bg="bg-purple-50" />
//           <MetricCard icon={<Clock size={24} />} value={hubDetails.performance?.avg_delivery_time ? `${hubDetails.performance.avg_delivery_time}m` : 'N/A'} label="Avg Time" color="#F59E0B" bg="bg-orange-50" />
//           <MetricCard icon={<AlertCircle size={24} />} value={hubDetails.performance?.cancellation_rate ? `${hubDetails.performance.cancellation_rate}%` : 'N/A'} label="Cancel Rate" color="#EC4899" bg="bg-pink-50" />
//         </div>
//       </div>

//       {/* Delivery Boys */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="w-1 h-5 rounded-full bg-green-700" />
//             <h2 className="text-lg font-bold text-gray-900">Delivery Boys</h2>
//           </div>
//           <div className="flex items-center justify-between p-6 bg-purple-50 rounded-xl">
//             <div className="flex items-center gap-4">
//               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm"><Truck size={32} style={{ color: '#8B5CF6' }} /></div>
//               <div>
//                 <p className="text-3xl font-bold text-gray-900">{hubDetails.drivers?.total_delivery_boys || 0}</p>
//                 <p className="text-sm text-gray-500">Total Delivery Boys</p>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-xl font-bold text-green-800">{hubDetails.drivers?.active_boys || 0}</p>
//               <p className="text-sm text-gray-500">Active Now</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="w-1 h-5 rounded-full bg-green-700" />
//             <h2 className="text-lg font-bold text-gray-900">Top Delivery Boys</h2>
//           </div>
//           {hubDetails.top_delivery_boys?.length > 0 ? (
//             <div className="space-y-3">
//               {hubDetails.top_delivery_boys.map((boy, index) => (
//                 <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50">
//                   <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center"><Star size={18} style={{ color: '#F59E0B' }} /></div>
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold capitalize text-gray-900">{boy.name || 'Delivery Boy'}</p>
//                     <p className="text-xs text-gray-500">{boy.completed_orders || 0} deliveries completed</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-400">
//               <Star size={32} className="mx-auto mb-2 opacity-50" />
//               <p className="text-sm">No top delivery boys yet</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Recent Disruptions */}
//       {hubDetails.recent_disruptions?.length > 0 && (
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="w-1 h-5 rounded-full bg-red-500" />
//             <h2 className="text-lg font-bold text-gray-900">Recent Disruptions</h2>
//           </div>
//           <div className="space-y-3">
//             {hubDetails.recent_disruptions.map((disruption, index) => (
//               <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
//                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"><AlertCircle size={20} style={{ color: '#DC2626' }} /></div>
//                 <p className="text-sm font-medium text-gray-900">{disruption.description || 'Disruption reported'}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// // ── Copyable Info Row ─────────────────────────────────────────────────────────
// const CopyableInfoRow = ({ icon, label, value, color, bg, copyable, copyValue, fieldName, copied, onCopy }) => (
//   <div className={`flex items-center gap-3 p-4 rounded-xl ${bg || 'bg-gray-50'} relative group`}>
//     <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
//       <span style={{ color }}>{icon}</span>
//     </div>
//     <div className="flex-1 min-w-0">
//       <p className="text-xs text-gray-400">{label}</p>
//       <p className="text-sm font-semibold text-gray-900 truncate">{value || 'N/A'}</p>
//     </div>
//     {copyable && (
//       <button
//         onClick={() => onCopy(copyValue, fieldName)}
//         className={`p-2 rounded-lg transition-all flex-shrink-0 ${
//           copied ? 'bg-green-100 text-green-700' : 'hover:bg-gray-200 text-gray-400 opacity-0 group-hover:opacity-100'
//         }`}
//         title={`Copy ${fieldName}`}
//       >
//         {copied ? <Check size={16} /> : <Copy size={16} />}
//       </button>
//     )}
//   </div>
// );

// // ── Simple Info Row ───────────────────────────────────────────────────────────
// const InfoRow = ({ icon, label, value }) => (
//   <div className="flex items-start gap-3">
//     <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0" style={{ color: Colors.primaryGreen }}>
//       {icon}
//     </div>
//     <div>
//       <p className="text-xs text-gray-400">{label}</p>
//       <p className="text-sm font-semibold capitalize text-gray-900">{value || 'N/A'}</p>
//     </div>
//   </div>
// );

// const MetricCard = ({ icon, value, label, color, bg }) => (
//   <div className={`${bg} rounded-xl p-4 text-center`}>
//     <div className="mx-auto mb-2" style={{ color }}>{icon}</div>
//     <p className="text-2xl font-bold text-gray-900">{value}</p>
//     <p className="text-xs text-gray-500 mt-1">{label}</p>
//   </div>
// );
// src/pages/hubs/HubDetails.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, User, Phone, Mail, Building2, TrendingUp,
  Package, CheckCircle, XCircle, Clock, Truck, AlertCircle,
  Star, Navigation, RefreshCw, CreditCard, FileText, Shield,
  Loader, Copy, Check, Send, Share2, Boxes, Layers, Tag,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import { useHubDetailsViewModel } from '../../hooks/HubDetailsViewModel';
import { useEditHubViewModel } from '../../hooks/useHubEditViewModel';
import toast from 'react-hot-toast';
import apiClient from '../../config/ApiConfig';

const Colors = {
  primaryGreen: '#14532D',
  primaryExtraLightGreen: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey1: '#6B7280',
};

export const HubDetails = () => {
  const { hubId } = useParams();
  const navigate = useNavigate();
  const { hubDetails, isLoading, error, fetchHubDetails } = useHubDetailsViewModel();
  const { hubProfile, isLoading: profileLoading, fetchHubProfile } = useEditHubViewModel();
  
  // Inventory states
  const [inventoryData, setInventoryData] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Copy states
  const [copiedField, setCopiedField] = useState(null);

  // ✅ Fetch inventory data
  const fetchInventory = useCallback(async () => {
    if (!hubId) return;
    setInventoryLoading(true);
    try {
      const response = await apiClient.post('hub/inventory-details', { hub_id: hubId });
      if (response.status === 200) {
        setInventoryData(response.data?.data);
        // Auto-expand first category
        if (response.data?.data?.inventory_list?.[0]) {
          setExpandedCategories({ [response.data.data.inventory_list[0].category_name]: true });
        }
      }
    } catch (error) {
      console.error('Inventory fetch error:', error);
    } finally {
      setInventoryLoading(false);
    }
  }, [hubId]);

  useEffect(() => {
    if (hubId) {
      fetchHubDetails(hubId);
      fetchHubProfile(hubId);
      fetchInventory(); // ✅ Fetch inventory
    }
  }, [hubId]);

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Copy functions
  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const copyAllLoginDetails = async () => {
    const hubUrl = "https://hub.fastocatz.com";
    const loginDetails = `🔐 Hub Manager Login Details\n\n` +
      `🌐 URL: ${hubUrl}\n` +
      `📧 Email: ${hubProfile?.email || 'N/A'}\n` +
      `🔑 Password: ${hubProfile?.password || 'N/A'}\n` +
      `🏢 Hub: ${hubDetails?.hub?.hub_name || 'N/A'}\n` +
      `👤 Manager: ${hubProfile?.name || 'N/A'}\n\n`;
    try {
      await navigator.clipboard.writeText(loginDetails);
      toast.success('All login details copied!');
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = loginDetails;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('All login details copied!');
    }
  };

  const shareViaWhatsApp = () => {
    const hubUrl = "https://hub.fastocatz.com";
    const message = `🔐 *Hub Manager Login Details*%0A%0A` +
      `🌐 *URL:* ${hubUrl}%0A` +
      `📧 *Email:* ${hubProfile?.email || 'N/A'}%0A` +
      `🔑 *Password:* ${hubProfile?.password || 'N/A'}%0A` +
      `🏢 *Hub:* ${hubDetails?.hub?.hub_name || 'N/A'}%0A` +
      `👤 *Manager:* ${hubProfile?.name || 'N/A'}%0A%0A`;
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const formatPhone = (phone) => {
    if (!phone) return 'N/A';
    return phone?.replace(/(\d{3})(\d{3})(\d{4})/, '+91 $1-$2-$3');
  };

  const formatAadhar = (number) => {
    if (!number) return 'N/A';
    const str = String(number);
    return `XXXX XXXX ${str.slice(-4)}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: 'Out of Stock', color: '#DC2626', bg: '#FEF2F2' };
    if (stock <= 5) return { text: 'Low Stock', color: '#F59E0B', bg: '#FFFBEB' };
    return { text: 'In Stock', color: '#16A34A', bg: '#F0FDF4' };
  };

  // Loading
  if (isLoading && profileLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (<div key={i} className="h-24 bg-gray-200 rounded-xl" />))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle size={32} className="text-red-500 mb-4" />
        <h2 className="text-lg font-semibold mb-2 text-gray-900">Failed to Load Hub Details</h2>
        <p className="text-sm mb-4 text-gray-500">{error}</p>
        <button onClick={() => { fetchHubDetails(hubId); fetchHubProfile(hubId); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium bg-green-800">
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  if (!hubDetails) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      
      {/* Back Button */}
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/hubs/all-hubs')}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium hover:bg-gray-50">
        <ArrowLeft size={18} /> Back to Hubs
      </motion.button>

      {/* Hub Header */}
      <div className="bg-gradient-to-br from-[#166534] to-[#14532D] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={20} className="text-white/80" />
              <h1 className="text-2xl font-bold capitalize">{hubDetails.hub?.hub_name}</h1>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <MapPin size={16} />
              <p className="text-sm">{hubDetails.hub?.city_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Actions Bar */}
      {hubProfile && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <Share2 size={18} className="text-green-800" />
            <span className="text-sm font-bold text-gray-800">Share Login Credentials</span>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <button onClick={copyAllLoginDetails}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 text-green-800 text-xs font-bold hover:bg-green-100 transition-colors border border-green-200">
                <Copy size={14} /> Copy All
              </button>
              <button onClick={shareViaWhatsApp}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors">
                <Send size={14} /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hub Information & Manager Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-700" />
            <h2 className="text-lg font-bold text-gray-900">Hub Information</h2>
          </div>
          <div className="space-y-4">
            <InfoRow icon={<Building2 size={18} />} label="Hub Name" value={hubDetails.hub?.hub_name} />
            <InfoRow icon={<Navigation size={18} />} label="City" value={hubDetails.hub?.city_name} />
            <InfoRow icon={<MapPin size={18} />} label="Full Address" value={hubDetails.hub?.address} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-700" />
            <h2 className="text-lg font-bold text-gray-900">Manager Details</h2>
          </div>
          <div className="space-y-4">
            <InfoRow icon={<User size={18} />} label="Manager Name" value={hubDetails.hub?.manager_name} />
            <InfoRow icon={<Phone size={18} />} label="Phone" value={formatPhone(hubDetails.hub?.manager_phone)} />
          </div>
        </div>
      </div>

      {/* ✅ INVENTORY SECTION */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-green-700" />
          <h2 className="text-lg font-bold text-gray-900">Hub Inventory</h2>
          {inventoryLoading && <Loader size={18} className="animate-spin text-green-800 ml-2" />}
          <button onClick={fetchInventory} className="ml-auto p-1.5 rounded-lg hover:bg-gray-100" title="Refresh">
            <RefreshCw size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Inventory Summary */}
        {inventoryData?.summary && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Boxes size={24} className="mx-auto mb-1 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{inventoryData.summary.total_skus}</p>
              <p className="text-xs text-gray-500">Total SKUs</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <Truck size={24} className="mx-auto mb-1 text-green-600" />
              <p className="text-2xl font-bold text-gray-900">{inventoryData.summary.total_units_dispatched}</p>
              <p className="text-xs text-gray-500">Units Dispatched</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <AlertCircle size={24} className="mx-auto mb-1 text-orange-600" />
              <p className="text-2xl font-bold text-gray-900">{inventoryData.summary.low_stock_alert_count}</p>
              <p className="text-xs text-gray-500">Low Stock Alerts</p>
            </div>
          </div>
        )}

        {/* Inventory List */}
        {inventoryLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl" />
            ))}
          </div>
        ) : inventoryData?.inventory_list?.length > 0 ? (
          <div className="space-y-3">
            {inventoryData.inventory_list.map((category, catIdx) => (
              <div key={catIdx} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.category_name)}
                  className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {category.category_img ? (
                      <img src={category.category_img} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Layers size={20} className="text-green-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{category.category_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{category.subcategory_name}</span>
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                        {category.products?.length || 0} products
                      </span>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: expandedCategories[category.category_name] ? 180 : 0 }}>
                    <ChevronDown size={20} className="text-gray-400" />
                  </motion.div>
                </button>

                {/* Products */}
                {expandedCategories[category.category_name] && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {category.products?.map((product) => (
                      <div key={product.product_id} className="p-4">
                        {/* Product Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.product_img ? (
                              <img src={product.product_img} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package size={18} className="text-gray-400 m-2.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800">{product.product_name}</p>
                            {product.brand_name && (
                              <span className="text-xs text-gray-400">{product.brand_name}</span>
                            )}
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full font-semibold">
                            {(product.variants || []).length} variants
                          </span>
                        </div>

                        {/* Variants */}
                        <div className="space-y-2 ml-13">
                          {product.variants?.map((variant) => {
                            const stockStatus = getStockStatus(parseInt(variant.current_stock) || 0);
                            return (
                              <div key={variant.variant_id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
                                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                                  {variant.variant_img ? (
                                    <img src={variant.variant_img} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <Tag size={14} className="text-gray-400 m-2" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-semibold text-gray-800">{variant.variant_value}</p>
                                    <span className="text-xs text-gray-400">SKU: {variant.sku}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {variant.discount_price && parseFloat(variant.discount_price) < parseFloat(variant.price) ? (
                                      <>
                                        <span className="text-xs font-bold text-green-700">{formatCurrency(variant.discount_price)}</span>
                                        <span className="text-xs text-gray-400 line-through">{formatCurrency(variant.price)}</span>
                                        <span className="text-xs text-green-600 font-semibold">({variant.discount_percent}% off)</span>
                                      </>
                                    ) : (
                                      <span className="text-xs font-bold text-gray-700">{formatCurrency(variant.price)}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <span className="text-xs font-bold" style={{ color: stockStatus.color }}>
                                    Stock: {variant.current_stock}
                                  </span>
                                  <p className="text-xs text-gray-400 mt-0.5">Sold: {variant.units_sold || 0}</p>
                                </div>
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: stockStatus.bg, color: stockStatus.color }}>
                                  {stockStatus.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Package size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No inventory data available</p>
          </div>
        )}
      </div>

      {/* Hub Manager Profile */}
      {hubProfile && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-700" />
            <h2 className="text-lg font-bold text-gray-900">Hub Manager Profile</h2>
          </div>
          {profileLoading ? (
            <div className="flex justify-center py-8"><Loader size={24} className="animate-spin text-green-800" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CopyableInfoRow icon={<User size={18} />} label="Name" value={hubProfile.name} color="#8B5CF6" bg="bg-purple-50" />
              <CopyableInfoRow icon={<Mail size={18} />} label="Email" value={hubProfile.email} color="#3B82F6" bg="bg-blue-50"
                copyable copyValue={hubProfile.email} fieldName="Email" copied={copiedField === 'Email'} onCopy={copyToClipboard} />
              <CopyableInfoRow icon={<Phone size={18} />} label="Phone" value={formatPhone(hubProfile.phone)} color="#14532D" bg="bg-green-50" />
              <CopyableInfoRow icon={<Shield size={18} />} label="Password" value={hubProfile.password || 'N/A'} color="#DC2626" bg="bg-red-50"
                copyable copyValue={hubProfile.password} fieldName="Password" copied={copiedField === 'Password'} onCopy={copyToClipboard} />
              <CopyableInfoRow icon={<MapPin size={18} />} label="Address" value={hubProfile.address} color="#F59E0B" bg="bg-orange-50" />
              <CopyableInfoRow icon={<CreditCard size={18} />} label="Aadhar Number" value={formatAadhar(hubProfile.adharno)} color="#0891B2" bg="bg-cyan-50" />
              <CopyableInfoRow icon={<FileText size={18} />} label="PAN Number" value={hubProfile.panno} color="#7C3AED" bg="bg-violet-50" />
            </div>
          )}
          {hubProfile.performance_stats && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded-full bg-green-700" />
                <h3 className="text-sm font-bold text-gray-900">Performance Stats</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{hubProfile.performance_stats.managed_orders || '0'}</p>
                  <p className="text-xs text-gray-500">Managed Orders</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{hubProfile.performance_stats.active_staff || '0'}</p>
                  <p className="text-xs text-gray-500">Active Staff</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900">{hubProfile.performance_stats.punctuality || '0%'}</p>
                  <p className="text-xs text-gray-500">Punctuality</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-5 rounded-full bg-green-700" />
          <h2 className="text-lg font-bold text-gray-900">Performance Metrics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard icon={<Package size={24} />} value={hubDetails.performance?.total_orders || 0} label="Total Orders" color="#3B82F6" bg="bg-blue-50" />
          <MetricCard icon={<CheckCircle size={24} />} value={hubDetails.performance?.completed_deliveries || 0} label="Completed" color="#10B981" bg="bg-green-50" />
          <MetricCard icon={<XCircle size={24} />} value={hubDetails.performance?.cancelled_orders || 0} label="Cancelled" color="#DC2626" bg="bg-red-50" />
          <MetricCard icon={<TrendingUp size={24} />} value={hubDetails.performance?.success_rate ? `${hubDetails.performance.success_rate}%` : 'N/A'} label="Success Rate" color="#8B5CF6" bg="bg-purple-50" />
          <MetricCard icon={<Clock size={24} />} value={hubDetails.performance?.avg_delivery_time ? `${hubDetails.performance.avg_delivery_time}m` : 'N/A'} label="Avg Time" color="#F59E0B" bg="bg-orange-50" />
          <MetricCard icon={<AlertCircle size={24} />} value={hubDetails.performance?.cancellation_rate ? `${hubDetails.performance.cancellation_rate}%` : 'N/A'} label="Cancel Rate" color="#EC4899" bg="bg-pink-50" />
        </div>
      </div>

      {/* Delivery Boys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-700" />
            <h2 className="text-lg font-bold text-gray-900">Delivery Boys</h2>
          </div>
          <div className="flex items-center justify-between p-6 bg-purple-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm"><Truck size={32} style={{ color: '#8B5CF6' }} /></div>
              <div><p className="text-3xl font-bold text-gray-900">{hubDetails.drivers?.total_delivery_boys || 0}</p><p className="text-sm text-gray-500">Total Delivery Boys</p></div>
            </div>
            <div className="text-right"><p className="text-xl font-bold text-green-800">{hubDetails.drivers?.active_boys || 0}</p><p className="text-sm text-gray-500">Active Now</p></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-green-700" />
            <h2 className="text-lg font-bold text-gray-900">Top Delivery Boys</h2>
          </div>
          {hubDetails.top_delivery_boys?.length > 0 ? (
            <div className="space-y-3">
              {hubDetails.top_delivery_boys.map((boy, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-yellow-50">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center"><Star size={18} style={{ color: '#F59E0B' }} /></div>
                  <div className="flex-1"><p className="text-sm font-semibold capitalize text-gray-900">{boy.name || 'Delivery Boy'}</p><p className="text-xs text-gray-500">{boy.completed_orders || 0} deliveries</p></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400"><Star size={32} className="mx-auto mb-2 opacity-50" /><p className="text-sm">No top delivery boys yet</p></div>
          )}
        </div>
      </div>

      {/* Recent Disruptions */}
      {hubDetails.recent_disruptions?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4"><div className="w-1 h-5 rounded-full bg-red-500" /><h2 className="text-lg font-bold text-gray-900">Recent Disruptions</h2></div>
          <div className="space-y-3">
            {hubDetails.recent_disruptions.map((disruption, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"><AlertCircle size={20} style={{ color: '#DC2626' }} /></div>
                <p className="text-sm font-medium text-gray-900">{disruption.description || 'Disruption reported'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ── Reusable Components ───────────────────────────────────────────────────────
const CopyableInfoRow = ({ icon, label, value, color, bg, copyable, copyValue, fieldName, copied, onCopy }) => (
  <div className={`flex items-center gap-3 p-4 rounded-xl ${bg || 'bg-gray-50'} relative group`}>
    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div className="flex-1 min-w-0"><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-semibold text-gray-900 truncate">{value || 'N/A'}</p></div>
    {copyable && (
      <button onClick={() => onCopy(copyValue, fieldName)}
        className={`p-2 rounded-lg transition-all flex-shrink-0 ${copied ? 'bg-green-100 text-green-700' : 'hover:bg-gray-200 text-gray-400 opacity-0 group-hover:opacity-100'}`}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    )}
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0" style={{ color: Colors.primaryGreen }}>{icon}</div>
    <div><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-semibold capitalize text-gray-900">{value || 'N/A'}</p></div>
  </div>
);

const MetricCard = ({ icon, value, label, color, bg }) => (
  <div className={`${bg} rounded-xl p-4 text-center`}>
    <div className="mx-auto mb-2" style={{ color }}>{icon}</div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);