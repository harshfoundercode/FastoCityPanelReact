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
  Filter,
  ArrowUpDown,
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

  // Filter and sort admin data
  const filteredAdminData = useMemo(() => {
    if (!adminHistory) return [];
    let result = [...adminHistory];

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => {
        const productNames = (item.products || []).map(p => (p.product_name || p.productName || '').toLowerCase()).join(' ');
        return String(item.request_id || item.requestId).toLowerCase().includes(q) || productNames.includes(q);
      });
    }

    // Filter by status
    if (adminStatus !== 'All') {
      result = result.filter(item => getAdminStatusText(item.status) === adminStatus);
    }

    // Sort
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

   const getLatestDate = (product) => {
    if (!product.transfers?.length) return new Date(2000);
    const dates = product.transfers.map(t => new Date(t.created_at || t.createdAt || 0)).filter(d => !isNaN(d));
    return dates.length ? new Date(Math.max(...dates)) : new Date(2000);
  };
  
  // Filter and sort hub data
  const filteredHubData = useMemo(() => {
    if (!hubHistory) return [];
    let result = [...hubHistory];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => {
        return (p.product_name || p.productName || '').toLowerCase().includes(q) ||
               (p.sku || '').toLowerCase().includes(q) ||
               (p.brand_name || p.brandName || '').toLowerCase().includes(q);
      });
    }

    if (hubStatus !== 'All') {
      result = result.filter(p => 
        (p.transfers || []).some(t => getHubStatusText(t.status) === hubStatus)
      );
    }

    result.sort((a, b) => {
      const aDate = getLatestDate(a);
      const bDate = getLatestDate(b);
      return sortBy === 'Oldest' ? aDate - bDate : bDate - aDate;
    });

    return result;
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

  const currentStatuses = activeTab === 0 ? ADMIN_STATUSES : HUB_STATUSES;
  const currentStatus = activeTab === 0 ? adminStatus : hubStatus;

  return (
    <div className="flex flex-col h-full">
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
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === i ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500'
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
              placeholder="Search by name, ID..."
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                currentStatus === status
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
                  <AdminRequestCard key={item.request_id || item.requestId} item={item} getStatusText={getAdminStatusText} getStatusColor={getStatusColor} formatDate={formatDate} />
                ))}
              </div>
            )
          ) : (
            isLoadingHub ? (
              <div className="flex justify-center py-12"><Loader size={32} className="animate-spin text-green-800" /></div>
            ) : filteredHubData.length === 0 ? (
              <EmptyState message="No transfers found" />
            ) : (
              <div className="space-y-2.5">
                {filteredHubData.map((product, i) => (
                  <HubTransferCard key={i} product={product} statusFilter={hubStatus} getStatusText={getHubStatusText} getStatusColor={getStatusColor} formatDate={formatDate} />
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
const AdminRequestCard = ({ item, getStatusText, getStatusColor, formatDate }) => {
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
        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${statusColor}15`, color: statusColor }}>
          {statusText}
        </span>
      </div>
    </div>
  );
};

// ── Hub Transfer Card ─────────────────────────────────────────────────────────
const HubTransferCard = ({ product, statusFilter, getStatusText, getStatusColor, formatDate }) => {
  const [expanded, setExpanded] = useState(false);

  const filteredTransfers = statusFilter === 'All'
    ? (product.transfers || [])
    : (product.transfers || []).filter(t => getStatusText(t.status) === statusFilter);

  const totalSent = filteredTransfers.reduce((sum, t) => {
    return sum + (t.variants || []).reduce((vSum, v) => vSum + (parseInt(v.sent_qty || v.sentQty) || 0), 0);
  }, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-3 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center overflow-hidden">
          {(product.product_img || product.productImg) ? (
            <img src={product.product_img || product.productImg} alt="" className="w-full h-full object-cover" />
          ) : (
            <Package size={18} className="text-green-800" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">{product.product_name || product.productName}</p>
          <p className="text-xs text-gray-400">SKU: {product.sku || 'N/A'}</p>
        </div>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
          {filteredTransfers.length} hubs
        </span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
          <ChevronDown size={18} className="text-gray-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && filteredTransfers.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {filteredTransfers.map((transfer, tIdx) => (
              <div key={tIdx} className="border-t border-gray-100 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={13} className="text-blue-600" />
                  <span className="text-xs font-semibold text-gray-800">{transfer.hub_name || transfer.hubName} - {transfer.hub_maneger_name || transfer.hubManegerName || 'N/A'}</span>
                  <div className="flex-1" />
                  <StatusBadge status={transfer.status} getStatusText={getStatusText} getStatusColor={getStatusColor} />
                </div>
                {(transfer.variants || []).map((v, vIdx) => (
                  <div key={vIdx} className="flex items-center gap-2 ml-5 mb-1">
                    <span className="text-xs text-gray-600 flex-1">{v.value || 'N/A'}</span>
                    <QtyChip label="Sent" value={v.sent_qty || v.sentQty} color={Colors.info} />
                    <QtyChip label="Rec" value={v.received_qty || v.receivedQty} color={Colors.success} />
                    {((v.missing_qty || v.missingQty) > 0) && (
                      <QtyChip label="Miss" value={v.missing_qty || v.missingQty} color={Colors.error} />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">{filteredTransfers.length} transfer(s)</span>
        <span className="text-xs text-gray-500">{totalSent} total sent</span>
      </div>
    </div>
  );
};

// ── Shared Components ─────────────────────────────────────────────────────────
const StatusBadge = ({ status, getStatusText, getStatusColor }) => {
  const text = getStatusText(status);
  const color = getStatusColor(status);
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${color}15`, color }}>
      {text}
    </span>
  );
};

const QtyChip = ({ label, value, color }) => (
  <span className="px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-1" style={{ backgroundColor: `${color}15`, color }}>
    {value || 0}
    <span className="text-xs opacity-70">{label}</span>
  </span>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <Inbox size={48} className="mb-3 opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);