// src/pages/HubRequestManagement.jsx
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
} from 'lucide-react';
import { useHubRequestViewModel } from '../hooks/useHubRequestViewModel';

const Colors = {
  primaryGreen: '#14532D',
  greenSoft: '#F0FDF4',
  textBlack: '#1F2937',
  textGrey: '#6B7280',
  border: '#E5E7EB',
  white: '#FFFFFF',
  bg: '#F4F6F9',
  accent: '#0F6E56',
  accentSoft: '#E1F5EE',
  warn: '#E65100',
  warnSoft: '#FFF3E0',
  error: '#C62828',
  errorSoft: '#FFEBEE',
  info: '#1565C0',
  infoSoft: '#E3F2FD',
};

const FILTERS = {
  all: 'All',
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const HubRequestManagement = () => {
  const { requests, isLoading, isAccepting, fetchRequests, acceptRequest } = useHubRequestViewModel();
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    if (filter === 'all') return requests;
    return requests.filter(r => {
      const status = getStatusString(r.status);
      return status === filter;
    });
  }, [requests, filter]);



  // Helpers
  const getStatusString = (status) => {
    switch (status?.toString()) {
      case '1': return 'accepted';
      case '2': return 'rejected';
      default: return 'pending';
    }
  };

  // Counts
  const pendingCount = requests.filter(r => getStatusString(r.status) === 'pending').length;

  const getStatusConfig = (status) => {
    const s = getStatusString(status);
    switch (s) {
      case 'accepted': return { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300', label: 'Accepted' };
      case 'rejected': return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', label: 'Rejected' };
      default: return { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-300', label: 'Pending' };
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const totalQty = (products) => {
    return (products || []).reduce((sum, p) => sum + (parseInt(p.requested_quantity) || 0), 0);
  };

  const totalVariants = (products) => {
    return (products || []).reduce((sum, p) => sum + (p.variants?.length || 0), 0);
  };

  const getUniqueCategories = (products) => {
    return [...new Set((products || []).map(p => p.category_name).filter(Boolean))];
  };

  // Loading
  if (isLoading && !requests.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size={32} className="animate-spin text-green-800" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-[55%] flex flex-col border-r border-gray-200">


          {/* Filter Bar */}
          <div className="px-3 py-2 bg-white border-b border-gray-200 flex gap-2">
            {Object.entries(FILTERS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${filter === key
                  ? 'bg-green-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {label}
                {key === 'pending' && pendingCount > 0 && (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${filter === key ? 'bg-white/25 text-white' : 'bg-orange-500 text-white'
                    }`}>
                    {pendingCount}
                  </span>
                )}
                {key === 'all' && (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${filter === key ? 'bg-white/25 text-white' : 'bg-green-800 text-white'
                    }`}>
                    {requests.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Requests List */}
          <div className="flex-1 overflow-y-auto p-3">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Inbox size={40} className="mb-2" />
                <p className="text-sm">No requests found.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <AnimatePresence>
                  {filteredRequests.map((req) => {
                    const statusConfig = getStatusConfig(req.status);
                    const hubName = req.hubmanager?.name || 'Unknown Hub';
                    const categories = getUniqueCategories(req.products);
                    const isSelected = selectedRequest?.request_id === req.request_id;

                    return (
                      <motion.div
                        key={req.request_id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedRequest(req)}
                        className={`bg-white rounded-xl border p-3 cursor-pointer transition-all ${isSelected ? 'border-green-800 shadow-md shadow-green-100' : 'border-gray-200 shadow-sm hover:shadow'
                          }`}
                      >
                        {/* Header */}
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}>
                            {getInitials(hubName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{hubName}</p>
                            <p className="text-xs text-gray-400">{req.created_at || ''}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {categories.slice(0, 3).map((cat, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-green-50 text-green-800 text-xs font-semibold">
                              {cat}
                            </span>
                          ))}
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                            {totalVariants(req.products)} variants · qty {totalQty(req.products)}
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

        {/* RIGHT PANEL */}
        <div className="w-[45%] flex flex-col">
          <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100">
            <span className="text-blue-700 font-bold text-sm">🔍 Request Details</span>
          </div>

          {!selectedRequest ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                <Inbox size={30} className="text-blue-600" />
              </div>
              <p className="text-sm font-bold text-gray-800">Please select a request.</p>
              <p className="text-xs text-gray-500 mt-1">Click on a request from the left panel to view details.</p>
            </div>
          ) : (
            <>
              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <DetailView
                  request={selectedRequest}
                  getStatusConfig={getStatusConfig}
                  totalQty={totalQty}
                  totalVariants={totalVariants}
                />
              </div>

              {/* Action Footer */}
              <ActionFooter
                request={selectedRequest}
                isAccepting={isAccepting}
                onAccept={() => acceptRequest(selectedRequest.request_id)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Detail View Component
const DetailView = ({ request, getStatusConfig, totalQty, totalVariants }) => {
  const statusConfig = getStatusConfig(request.status);
  const hubName = request.hubmanager?.name || '-';

  return (
    <div className="space-y-4">
      {/* Info Chips */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Request Info</p>
        <div className="grid grid-cols-2 gap-2">
          <InfoChip label="Request ID" value={request.request_id || '-'} />
          <InfoChip label="Hub" value={hubName} />
          <InfoChip label="Total Variants" value={totalVariants(request.products)} />
          <InfoChip label="Total Qty" value={`${totalQty(request.products)} units`} />
          <InfoChip
            label="Status"
            value={statusConfig.label}
            valueColor={statusConfig.color}
          />
        </div>
      </div>

      {/* Products */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Requested Products</p>
        <div className="space-y-2.5">
          {(request.products || []).map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    {/* Product Header */}
    <div className="p-2.5 flex items-center gap-2.5">
      {product.product_img ? (
        <img src={product.product_img} alt="" className="w-8 h-8 rounded-lg object-cover" />
      ) : (
        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
          <Package size={16} className="text-green-800" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-800 truncate">{product.product_name || 'Unknown'}</p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>{product.category_name}</span>
          {product.brand_name && <span>· {product.brand_name}</span>}
        </div>
      </div>
      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
        Req: {product.requested_quantity || 0}
      </span>
      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-bold">
        {(product.variants?.length || 0)} variant{product.variants?.length !== 1 ? 's' : ''}
      </span>
    </div>

    {/* Variants */}
    {(product.variants || []).map((variant, idx) => (
      <div key={idx} className="px-2.5 py-2 border-t border-gray-100 flex items-center">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800">{variant.variant_value || 'Default'}</p>
          {variant.sku && <p className="text-xs text-gray-400">SKU: {variant.sku}</p>}
        </div>
        {variant.discount_price && (
          <span className="text-xs font-bold text-green-800 mr-2">₹{variant.discount_price}</span>
        )}
        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${(parseInt(variant.current_stock) || 0) > 0
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'
          }`}>
          Stock: {variant.current_stock || 0}
        </span>
      </div>
    ))}
  </div>
);

// Info Chip Component
const InfoChip = ({ label, value, valueColor }) => (
  <div className="bg-gray-50 rounded-lg border border-gray-200 px-2.5 py-2">
    <p className="text-xs text-gray-400">{label}</p>
    <p className={`text-sm font-bold truncate ${valueColor || 'text-gray-800'}`}>{value}</p>
  </div>
);

// Action Footer Component
const ActionFooter = ({ request, isAccepting, onAccept }) => {
  const status = request.status?.toString();
  const isPending = status === '0' || !status || status === undefined;

  if (!isPending) {
    const isAccepted = status === '1';
    return (
      <div className={`mx-3 mb-4 p-3 rounded-xl flex items-center gap-2.5 ${isAccepted ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
        {isAccepted ? (
          <CheckCircle size={18} className="text-green-700" />
        ) : (
          <XCircle size={18} className="text-red-700" />
        )}
        <span className={`text-xs font-bold ${isAccepted ? 'text-green-700' : 'text-red-700'}`}>
          {isAccepted
            ? 'This request has already been accepted.'
            : 'This request has already been rejected.'}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-200 px-3 py-3 shadow-md">
      {isAccepting ? (
        <div className="flex justify-center py-2">
          <Loader size={22} className="animate-spin text-green-800" />
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAccept}
          className="w-full py-3 rounded-xl bg-green-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-colors shadow-sm"
        >
          <CheckCircle size={18} />
          Accept Request
        </motion.button>
      )}
    </div>
  );
};